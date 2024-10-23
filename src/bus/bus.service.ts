import {
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

@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Line) private lineRepo: Repository<Line>,
    @InjectRepository(Station) private stationRepo: Repository<Station>,
    private departmentService: DepartmentService,
  ) {}

  async create(createBusDto: CreateLineDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createBusDto.departmentName,
    );
    if (!department)
      throw new NotFoundException(
        `The department with ${createBusDto.departmentName} does not exists.`,
      );

    if (createBusDto.departmentName.toLocaleLowerCase() != 'traffic')
      throw new UnauthorizedException(
        'The service is not allowed to be assigned here',
      );

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
    });

    return await this.lineRepo.save(newLine);
  }

  async findAll() {
    return await this.lineRepo.find({ relations: ['toStations'] });
  }

  async findOneLine(id: number) {
    return await this.lineRepo.findOne({
      where: { id: id },
      relations: ['toStations'],
    });
  }

  async updateLine(id: number, updateBusDto: UpdateBusDto) {
    // Find the existing line by ID
    const line = await this.lineRepo.findOne({
      where: { id: id },
      relations: ['toStations'],
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
}
