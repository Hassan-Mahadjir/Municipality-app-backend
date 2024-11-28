import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateBusDto } from './dto/update-line.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Line } from 'src/entities/line.entity';
import { In, Repository } from 'typeorm';
import { Station } from 'src/entities/station.entity';
import { DepartmentService } from 'src/department/department.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStation } from './dto/update-station.dto';
import { CreateSechduleDto } from './dto/create-sechdule.dto';
import { Day } from 'src/entities/day.entity';
import { TimeTable } from 'src/entities/time-table.entity';
import { UpdateSechduleDto } from './dto/update-sechdule.dto';
import { dayTranslation } from 'src/entities/dayTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';

@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Line) private lineRepo: Repository<Line>,
    @InjectRepository(Station) private stationRepo: Repository<Station>,
    private departmentService: DepartmentService,
    @InjectRepository(Day) private dayRepo: Repository<Day>,
    @InjectRepository(TimeTable) private timeTableRepo: Repository<TimeTable>,
    @InjectRepository(dayTranslation) private translationRepo: Repository<dayTranslation>,
    private translationService: TranslationService,
  ) {}

  async create(createBusDto: CreateLineDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createBusDto.departmentName,
    );
    const ids = createBusDto.workingDaysTimes.map((item) => item.id);
    const days = await this.dayRepo.find({ where: { id: In(ids) } });

    // Check if all provided IDs are present in the fetched days
    const fetchedIds = days.map((day) => day.id);
    const missingIds = ids.filter((id) => !fetchedIds.includes(id));

    if (!department)
      throw new NotFoundException(
        `The department with ${createBusDto.departmentName} does not exists.`,
      );

    if (createBusDto.departmentName.toLocaleLowerCase() != 'traffic')
      throw new UnauthorizedException(
        'The service is not allowed to be assigned here',
      );

    if (missingIds.length > 0) {
      throw new NotFoundException(
        `The following days with IDs are not found in the database: ${missingIds.join(', ')}. Please add these days first.`,
      );
    }

    const stations = await this.stationRepo.find({
      where: { name: In(createBusDto.stationNames) },
    });

    for (const stationName of createBusDto.stationNames) {
      // Check if the station name exists in the fetched stations
      const stationExists = stations.some(
        (station) => station.name === stationName,
      );

      if (!stationExists) {
        throw new NotFoundException(
          `The station: ${stationName} is not in the database. You need to add the station before proceeding.`,
        );
      }
    }

    if (!stations.length)
      throw new NotFoundException('No valid stations were found.');

    // Create new Line entity
    const newLine = this.lineRepo.create({
      from: createBusDto.from,
      to: createBusDto.to,
      department: department,
      toStations: stations,
      sechdule: days,
    });

    return await this.lineRepo.save(newLine);
  }

  async findAll() {
    return await this.lineRepo.find({
      relations: ['toStations', 'sechdule', 'sechdule.timeTable'],
    });
  }

  async findOneLine(id: number) {
    return await this.lineRepo.findOne({
      where: { id: id },
      relations: ['toStations', 'sechdule', 'sechdule.timeTable'],
    });
  }

  async updateLine(id: number, updateBusDto: UpdateBusDto) {
    // Find the existing line by ID
    const line = await this.lineRepo.findOne({
      where: { id: id },
      relations: ['toStations', 'sechdule', 'sechdule.timeTable'],
    });

    // Check if the line exists
    if (!line) throw new NotFoundException(`Line with ID ${id} not found.`);

    // Update properties
    line.from = updateBusDto.from || line.from;
    line.to = updateBusDto.to || line.to;

    // Handle many-to-many relationship with stations if provided
    if (updateBusDto.stationNames) {
      const stations = await this.stationRepo.find({
        where: { name: In(updateBusDto.stationNames) },
      });

      for (const stationName of updateBusDto.stationNames) {
        // Check if the station name exists in the fetched stations
        const stationExists = stations.some(
          (station) => station.name === stationName,
        );

        if (!stationExists) {
          throw new NotFoundException(
            `The station: ${stationName} is not in the database. You need to add the station before proceeding.`,
          );
        }
      }

      line.toStations = stations; // Update teh toStations with the new list of stations
    }

    // Handle many-to-many relationship with days (sechdule) if provided
    if (updateBusDto.workingDaysTimes) {
      const ids = updateBusDto.workingDaysTimes.map((item) => item.id);
      const days = await this.dayRepo.find({ where: { id: In(ids) } });

      const fetchedIds = days.map((day) => day.id);
      const missingIds = ids.filter((id) => !fetchedIds.includes(id));

      if (missingIds.length > 0) {
        throw new NotFoundException(
          `The following days with IDs are not found in the database: ${missingIds.join(', ')}. Please add these days first.`,
        );
      }

      line.sechdule = days; // Update days with the new list
    }

    await this.lineRepo.save(line);

    return { message: `Line wiht ID: ${id} has been updated.`, line };
  }

  async deleteLine(lineId: number) {
    const line = await this.lineRepo.findOne({
      where: { id: lineId },
      relations: ['toStations'],
    });

    if (!line) {
      throw new NotFoundException(`Line with ID ${lineId} not found.`);
    }

    for (let index = 0; index < line.toStations.length; index++) {
      const station = line.toStations[index];

      if (Array.isArray(station.route)) {
        station.route = station.route.filter((s) => s.id !== lineId);

        await this.stationRepo.save(station);
      }
    }

    await this.lineRepo.remove(line);

    return { message: `Line with ID ${lineId} has been deleted.` };
  }

  async createStation(createStationDTO: CreateStationDto) {
    return await this.stationRepo.save(createStationDTO);
  }

  async updateStation(id: number, body: UpdateStation) {
    return await this.stationRepo.update({ id: id }, body);
    // new commit
    
  }

  async findAllStation() {
    return await this.stationRepo.find();
  }

  async findSation(id: number) {
    return await this.stationRepo.findOne({
      where: { id: id },
      relations: ['route'],
    });
  }

  async deleteStation(stationId: number) {
    const station = await this.stationRepo.findOne({
      where: { id: stationId },
      relations: ['route'], // Load associated lines
    });

    if (!station) {
      throw new NotFoundException(`Station with ID ${stationId} not found.`);
    }

    // Iterate through each line the station is associated with
    for (let index = 0; index < station.route.length; index++) {
      const line = station.route[index];

      // Ensure toStations is an array before filtering
      if (Array.isArray(line.toStations)) {
        // Remove the station from the line's toStations array
        line.toStations = line.toStations.filter((s) => s.id !== stationId);

        // Save the updated line to persist the changes
        await this.lineRepo.save(line);
      }
    }

    // Delete the station from the database after disassociating it from all lines
    await this.stationRepo.remove(station);

    return { message: `Station with ID ${stationId} has been deleted.` };
  }

  async createBusTime(createTimesDto: UpdateSechduleDto) {
    for (let index = 0; index < createTimesDto.goTimes.length; index++) {
      let goTime = createTimesDto.goTimes[index];
      let returnTime = createTimesDto.returnTimes[index];

      // Check if goTime already exists
      const existingGoTime = await this.timeTableRepo.findOne({
        where: { goTime: goTime },
      });

      // Check if returnTime already exists
      const existingReturnTime = await this.timeTableRepo.findOne({
        where: { returnTime: returnTime },
      });

      // Only create new bus time if neither goTime nor returnTime exist
      if (!existingGoTime && !existingReturnTime) {
        let newBusTime = this.timeTableRepo.create({
          goTime: goTime,
          returnTime: returnTime,
        });
        await this.timeTableRepo.save(newBusTime);
      } else {
        console.log(
          `Duplicate found: goTime=${goTime} or returnTime=${returnTime}. Skipping...`,
        );
      }
    }
  }

  async getAllSechdule(){
    return await this.dayRepo.find({relations:['translations']});
  }
  async createSechdule(createSechduleDto: CreateSechduleDto) {
    // Step 1: Check if all goTimes exist in the database
    const existingTimeTables = await this.timeTableRepo.find({
      where: { goTime: In(createSechduleDto.goTimes) },
    });

    // Get the goTimes that are found in the database
    const existingGoTimes = existingTimeTables.map((tt) => tt.goTime);

    // Step 2: Find goTimes that are missing in the database
    const missingGoTimes = createSechduleDto.goTimes.filter(
      (goTime) => !existingGoTimes.includes(goTime),
    );

    // Step 3: If any goTimes are missing, throw an error
    if (missingGoTimes.length > 0) {
      throw new NotFoundException(
        `The following goTimes are not in the database: ${missingGoTimes.join(', ')}. Please add these times first.`,
      );
    }

    // Step 4: Check if a day with the same name already exists
    const existingDay = await this.dayRepo.find({
      where: { day: createSechduleDto.day },
      relations: ['timeTable',"translations"], // Fetch timeTable relationship
    });

    if (existingDay.length > 0) {
      for (const day of existingDay) {
        // Step 5: Get the existing goTimes for each day entry
        const existingDayGoTimes = day.timeTable.map(
          (timeTable) => timeTable.goTime,
        );

        // Step 6: Sort both arrays for easier comparison
        const sortedExistingGoTimes = existingDayGoTimes.sort();
        const sortedNewGoTimes = [...createSechduleDto.goTimes].sort();

        // Step 7: Compare both arrays exactly; if they match, throw an error
        const goTimesMatch =
          sortedExistingGoTimes.length === sortedNewGoTimes.length &&
          sortedExistingGoTimes.every(
            (time, index) => time === sortedNewGoTimes[index],
          );

        if (goTimesMatch) {
          throw new ConflictException(
            `The goTimes for ${createSechduleDto.day} already exist and are identical. No new entry created.`,
          );
        }
      }
    }

    // Step 8: If no exact match is found, create a new day with the new goTimes
    const newDay = await this.dayRepo.create({
      day: createSechduleDto.day,
      language:createSechduleDto.language
    });

    const savedNewDay = await this.dayRepo.save(newDay);

    // Assign the valid timeTable entries to the new day
    newDay.timeTable = existingTimeTables;
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createSechduleDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    for(const targetLang of targetLanguages){
      const translatedDay = createSechduleDto.day?await this.translationService.translateText(createSechduleDto.day,targetLang):null;

      const translatedTranslation = this.translationRepo.create({
        day:translatedDay || 'Translation unavailable',
        language:targetLang,
        dayTranslation:savedNewDay
      });

      await this.translationRepo.save(translatedTranslation);
    }

    // Step 9: Save the new day
    return {message:`Day has been created successfully`,data:savedNewDay}
  }

  async updateBusTime(dayId: number, updateBusTimeDto: UpdateSechduleDto) {
    // Step 1: Retrieve the day by id with existing timeTable relations
    const day = await this.dayRepo.findOne({
      where: { id: dayId },
      relations: ['timeTable'],
    });

    if (!day) {
      throw new NotFoundException(`Day with ID ${dayId} not found.`);
    }

    // Step 2: Update the day name if provided
    if (updateBusTimeDto.day) {
      day.day = updateBusTimeDto.day;
    }

    // Step 3: Update goTimes if provided, ensuring no duplicates
    if (updateBusTimeDto.goTimes && Array.isArray(updateBusTimeDto.goTimes)) {
      // Remove duplicate goTimes from the request
      const uniqueGoTimes = Array.from(new Set(updateBusTimeDto.goTimes));

      // Check if all unique goTimes are present in the timeTableRepo
      const newGoTimes = await this.timeTableRepo.find({
        where: { goTime: In(uniqueGoTimes) },
      });

      if (newGoTimes.length !== uniqueGoTimes.length) {
        // Identify missing goTimes by checking if each unique goTime is in newGoTimes
        const missingGoTimes = uniqueGoTimes.filter(
          (goTime) => !newGoTimes.some((time) => time.goTime === goTime),
        );

        // Throw an error listing each missing goTime
        throw new NotFoundException(
          `The following goTimes are not in the database: ${missingGoTimes.join(', ')}. Please add these times before updating.`,
        );
      }

      // Replace the existing timeTable entries with the new ones
      day.timeTable = newGoTimes;
    }

    // Step 4: Save the updated day
    return await this.dayRepo.save(day);
  }

  async deleteBusTime(dayId: number) {
    const day = await this.dayRepo.findOne({
      where: { id: dayId },
      relations: ['timeTable'],
    });

    if (!day) {
      throw new NotFoundException(`Day with ID ${dayId} not found.`);
    }

    // Remove the associated times by clearing the timeTable relationship
    day.timeTable = [];
    await this.dayRepo.save(day);

    // Now proceed to delete the day itself
    await this.dayRepo.remove(day);

    return {
      message: `The Day with ID ${dayId} and its associated times have been removed.`,
    };
  }
}
