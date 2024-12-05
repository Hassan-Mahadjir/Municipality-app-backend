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
    @InjectRepository(dayTranslation)
    private translationRepo: Repository<dayTranslation>,
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

    await this.lineRepo.save(newLine);

    return { message: `Line has been created successfully.`, data: newLine };
  }

  async findAll() {
    const allLines = await this.lineRepo.find({
      relations: [
        'toStations',
        'sechdule',
        'sechdule.timeTable',
        'sechdule.translations',
      ],
    });

    return {
      message: `Successfully fetched ${allLines.length} routes`,
      data: allLines,
    };
  }

  async findOneLine(id: number) {
    const line = await this.lineRepo
      .createQueryBuilder('line')
      .leftJoinAndSelect('line.toStations', 'toStations')
      .leftJoinAndSelect('line.sechdule', 'sechdule')
      .leftJoinAndSelect('sechdule.timeTable', 'timeTable')
      .leftJoinAndSelect('sechdule.translations', 'translations')
      .orderBy('timeTable.goTime', 'ASC') // Order timeTable by goTime in ascending order
      .where('line.id = :id', { id })
      .getOne();

    return { message: `Line has been fetched successfully`, data: line };
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
    const station = await this.stationRepo.save(createStationDTO);
    return { message: `Station has been create successfully`, data: station };
  }

  async updateStation(id: number, body: UpdateStation) {
    await this.stationRepo.update({ id: id }, body);
    return {
      message: `The station with ID:${id} has been updated successfully.`,
    };
    // new commit
  }

  async findAllStation() {
    const stations = await this.stationRepo.find();
    return {
      massage: `${stations.length} Stations have been fetech successfully.`,
      data: stations,
    };
  }

  async findSation(id: number) {
    const stationInfo = await this.stationRepo.findOne({
      where: { id: id },
      relations: ['route'],
    });

    return {
      message: `Station has been fetched successfully.`,
      data: stationInfo,
    };
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

    return { message: 'New times have been created successfully.' };
  }

  async getAllSechdule() {
    const schedules = await this.dayRepo.find({
      relations: [
        'path',
        'translations',
        'path.sechdule.timeTable',
        'path.sechdule.translations',
      ],
    });

    return {
      message: 'Schdedule have been fetched successfully.',
      data: schedules,
    };
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

    // Step 4: Translate the day to English if necessary
    let translatedDay = createSechduleDto.day; // Default to the input day
    if (createSechduleDto.language !== 'EN') {
      translatedDay = await this.translationService.translateText(
        createSechduleDto.day,
        'EN',
      );
    }

    // Step 5: Check if a day with the same name already exists
    const existingDay = await this.dayRepo.find({
      where: { day: translatedDay }, // Check against the English version
      relations: ['timeTable', 'translations'], // Fetch timeTable relationship
    });

    if (existingDay.length > 0) {
      for (const day of existingDay) {
        // Step 6: Get the existing goTimes for each day entry
        const existingDayGoTimes = day.timeTable.map(
          (timeTable) => timeTable.goTime,
        );

        // Step 7: Sort both arrays for easier comparison
        const sortedExistingGoTimes = existingDayGoTimes.sort();
        const sortedNewGoTimes = [...createSechduleDto.goTimes].sort();

        // Step 8: Compare both arrays exactly; if they match, throw an error
        const goTimesMatch =
          sortedExistingGoTimes.length === sortedNewGoTimes.length &&
          sortedExistingGoTimes.every(
            (time, index) => time === sortedNewGoTimes[index],
          );

        if (goTimesMatch) {
          throw new ConflictException(
            `The goTimes for ${translatedDay} already exist and are identical. No new entry created.`,
          );
        }
      }
    }

    // Step 9: Create the new day with the English version of the day
    const newDay = await this.dayRepo.create({
      day: translatedDay, // Store the English version
      language: 'EN', // Ensure the language is set to English
    });

    const savedNewDay = await this.dayRepo.save(newDay);

    // Assign the timeTable relationship and save
    savedNewDay.timeTable = existingTimeTables;
    await this.dayRepo.save(savedNewDay);

    // Step 10: Store translations in the translation table
    const allLanguages = ['EN', 'TR']; // Add more languages if needed
    const sourceLang = createSechduleDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== 'EN'); // Skip English for translations

    for (const targetLang of targetLanguages) {
      const translation = await this.translationService.translateText(
        createSechduleDto.day, // Use the original input day for translation
        targetLang,
      );

      const translatedEntry = this.translationRepo.create({
        day: translation || 'Translation unavailable', // Translated text
        language: targetLang, // Target language
        dayTranslation: savedNewDay, // Link to the main day entry
      });

      await this.translationRepo.save(translatedEntry);
    }

    // Step 11: Return success message with saved day data
    return { message: `Day has been created successfully`, data: savedNewDay };
  }

  async updateBusTime(dayId: number, updateBusTimeDto: UpdateSechduleDto) {
    // Step 1: Retrieve the day by ID with existing timeTable and translations relations
    const day = await this.dayRepo.findOne({
      where: { id: dayId },
      relations: ['timeTable', 'translations'],
    });

    if (!day) {
      throw new NotFoundException(`Day with ID ${dayId} not found.`);
    }

    // Step 2: Update the day name if provided
    if (updateBusTimeDto.day) {
      let translatedDay = updateBusTimeDto.day; // Default to the input day

      // Translate to English if the input language is not English
      if (updateBusTimeDto.language !== 'EN') {
        translatedDay = await this.translationService.translateText(
          updateBusTimeDto.day,
          'EN',
        );
      }

      day.day = translatedDay;

      // Step 3: Update or add translations for the day name
      const allLanguages = ['EN', 'TR']; // Add more languages if necessary
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== 'EN', // Exclude English for translation
      );

      for (const targetLang of targetLanguages) {
        // Translate the day name to the target language
        const translatedText = await this.translationService.translateText(
          updateBusTimeDto.day,
          targetLang,
        );

        // Check if a translation for this language already exists
        const existingTranslation = day.translations.find(
          (translation) => translation.language === targetLang,
        );

        if (existingTranslation) {
          // Update the existing translation
          existingTranslation.day = translatedText || 'Translation unavailable';
        } else {
          // Add a new translation
          const newTranslation = this.translationRepo.create({
            day: translatedText || 'Translation unavailable',
            language: targetLang,
            dayTranslation: day,
          });

          await this.translationRepo.save(newTranslation);
        }
      }
    }

    // Step 4: Update goTimes if provided, ensuring no duplicates
    if (updateBusTimeDto.goTimes && Array.isArray(updateBusTimeDto.goTimes)) {
      // Remove duplicate goTimes from the request
      const uniqueGoTimes = Array.from(new Set(updateBusTimeDto.goTimes));

      // Check if all unique goTimes exist in the database
      const newGoTimes = await this.timeTableRepo.find({
        where: { goTime: In(uniqueGoTimes) },
      });

      if (newGoTimes.length !== uniqueGoTimes.length) {
        // Identify missing goTimes
        const missingGoTimes = uniqueGoTimes.filter(
          (goTime) => !newGoTimes.some((time) => time.goTime === goTime),
        );

        throw new NotFoundException(
          `The following goTimes are not in the database: ${missingGoTimes.join(', ')}. Please add these times before updating.`,
        );
      }

      // Replace the existing timeTable entries with the new ones
      day.timeTable = newGoTimes;
    }

    // Step 5: Save the updated day
    const updatedDay = await this.dayRepo.save(day);

    return {
      message: `Day has been updated successfully.`,
      data: updatedDay,
    };
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
