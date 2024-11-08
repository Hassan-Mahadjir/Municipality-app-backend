import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEmergencyContactDto } from './dto/create-emergency-contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-emergency-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmergencyContact } from 'src/entities/emergency-contact.entity';
import { Repository } from 'typeorm';
import { DepartmentService } from 'src/department/department.service';
import { ImageService } from 'src/image/image.service';
import { UpdateSechduleDto } from 'src/bus/dto/update-sechdule.dto';
import { UpdateWasteSechduleDto } from './dto/update-waste-sechdule.dto';
import { WasteType } from 'src/entities/waste-type.entity';
import { WasteSechdule } from 'src/entities/waste-sechdule.entity';
import { CreateWasteTypeDto } from './dto/create-waste-type.dto';
import { UpdateWasteTypeDto } from './dto/update-waste-type.dto';
import { CreateWasteSechduleDto } from './dto/create-waste-sechdule.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(EmergencyContact)
    private emergencyRepo: Repository<EmergencyContact>,
    private departmentService: DepartmentService,
    private imageService: ImageService,
    @InjectRepository(WasteType) private wasteTypeRepo: Repository<WasteType>,
    @InjectRepository(WasteSechdule)
    private wasteSechduleRepo: Repository<WasteSechdule>,
  ) {}
  async createEmergencyContact(
    createEmergencyContactDto: CreateEmergencyContactDto,
  ) {
    const department = await this.departmentService.findDepartmentbyName(
      createEmergencyContactDto.departmentName,
    );

    if (!department)
      throw new NotFoundException(
        `The department ${createEmergencyContactDto.departmentName} does not exist.`,
      );

    if (createEmergencyContactDto.departmentName.toLowerCase() !== 'community')
      throw new UnauthorizedException(
        `The service is not allowed to assign here.`,
      );

    // Check for existing contact with the same phone number or name
    const existingContact = await this.emergencyRepo.findOne({
      where: [
        { phone: createEmergencyContactDto.phone },
        { name: createEmergencyContactDto.name },
      ],
    });

    if (existingContact) {
      throw new ConflictException(
        'An emergency contact with this phone number or name already exists.',
      );
    }

    const newContact = this.emergencyRepo.create({
      ...createEmergencyContactDto,
      department: department,
    });

    return this.emergencyRepo.save(newContact);
  }

  async findAllEmergencyContacts() {
    return await this.emergencyRepo.find();
  }

  async findOneEmergencyContact(id: number) {
    const contactInfo = await this.emergencyRepo.findOne({ where: { id: id } });
    if (!contactInfo)
      throw new NotFoundException(
        `The emergenecy contact with ID:${id} does not exit.`,
      );

    return contactInfo;
  }

  async updateEmergencyContact(
    id: number,
    updateEmergencyContactDto: UpdateEmergencyContactDto,
  ) {
    await this.emergencyRepo.update({ id: id }, updateEmergencyContactDto);
    return {
      message: `The emergency contacted with ID:${id} has been updated successfully.`,
    };
  }

  async removeEmergencyContact(id: number) {
    const emergencyContact = await this.emergencyRepo.findOne({
      where: { id: id },
    });
    if (!emergencyContact)
      throw new NotFoundException(
        `The Emergency contact with ID:${id} does not exist.`,
      );

    await this.emergencyRepo.remove(emergencyContact);

    return {
      message: `Emergency contact with ID:${id} have been removed.`,
    };
  }

  async createWasteType(createWasteTypeDto: CreateWasteTypeDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createWasteTypeDto.departmentName,
    );
    const type = await this.wasteTypeRepo.findOne({
      where: { type: createWasteTypeDto.type },
    });

    if (type)
      throw new ConflictException(
        `The type:${createWasteTypeDto.type} is in the database.`,
      );
    if (!department)
      throw new NotFoundException(
        `The department ${createWasteTypeDto.departmentName} does not exist.`,
      );

    if (createWasteTypeDto.departmentName.toLowerCase() !== 'community')
      throw new UnauthorizedException(
        `The service is not allowed to assign here.`,
      );

    const newType = await this.wasteTypeRepo.create({
      type: createWasteTypeDto.type,
      department: department,
    });

    return this.wasteTypeRepo.save(newType);
  }

  async modifyWasteType(id: number, updateWasteTypeDto: UpdateWasteTypeDto) {
    return this.wasteTypeRepo.update({ id: id }, updateWasteTypeDto);
  }

  async createWasteSechdule(createWasteSechduleDto: CreateWasteSechduleDto) {
    const type = await this.wasteTypeRepo.findOne({
      where: { type: createWasteSechduleDto.wasteType },
    });

    if (!type) {
      throw new NotFoundException(
        `The type: ${createWasteSechduleDto.wasteType} does not exist.`,
      );
    }

    // Check for duplicate days in the array
    const days = createWasteSechduleDto.days.map((item) =>
      item.day.toLowerCase(),
    );
    const uniqueDays = new Set(days);

    if (uniqueDays.size !== days.length) {
      throw new BadRequestException('Duplicate days found in the schedule.');
    }

    // Save each unique schedule to the database
    for (const item of createWasteSechduleDto.days) {
      const newSechdule = await this.wasteSechduleRepo.create({
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
        wasteType: type,
      });

      await this.wasteSechduleRepo.save(newSechdule);
    }

    return { message: `The schedules have been created.` };
  }

  async updateWasteSechdule(
    id: number,
    updateWasteSechduleDto: UpdateWasteSechduleDto,
  ) {
    // Validate that the WasteType exists if provided
    if (updateWasteSechduleDto.wasteType) {
      const wasteType = await this.wasteTypeRepo.findOne({
        where: { type: updateWasteSechduleDto.wasteType },
      });
      if (!wasteType) {
        throw new NotFoundException(
          `Waste type '${updateWasteSechduleDto.wasteType}' not found.`,
        );
      }
    }

    // Check if any days are provided
    if (
      !updateWasteSechduleDto.days ||
      updateWasteSechduleDto.days.length === 0
    ) {
      throw new BadRequestException('No days provided to update.');
    }

    for (const daySchedule of updateWasteSechduleDto.days) {
      // Check if the schedule for the day already exists
      const existingSchedule = await this.wasteSechduleRepo.findOne({
        where: { day: daySchedule.day, wasteType: { id } },
      });

      if (existingSchedule) {
        // Update the existing schedule
        existingSchedule.startTime = daySchedule.startTime;
        existingSchedule.endTime = daySchedule.endTime;
        await this.wasteSechduleRepo.save(existingSchedule);
      } else {
        // Create a new schedule entry if it doesn't exist
        const newSechdule = this.wasteSechduleRepo.create({
          day: daySchedule.day,
          startTime: daySchedule.startTime,
          endTime: daySchedule.endTime,
          wasteType: await this.wasteTypeRepo.findOne({
            where: { type: updateWasteSechduleDto.wasteType },
          }),
        });
        await this.wasteSechduleRepo.save(newSechdule);
      }
    }

    return { message: `The schedules have been updated successfully.` };
  }

  async deleteWasteType(id: number) {
    // Find the WasteType by ID
    const wasteType = await this.wasteTypeRepo.findOne({
      where: { id },
      relations: ['sechdules'], // Load associated WasteSechdule entities
    });

    if (!wasteType) {
      throw new NotFoundException(`Waste type with ID '${id}' not found.`);
    }

    // Remove associations in WasteSechdule before deleting the WasteType
    if (wasteType.sechdules.length > 0) {
      for (const sechdule of wasteType.sechdules) {
        sechdule.wasteType = null; // Remove association
        await this.wasteSechduleRepo.save(sechdule); // Update in the database
      }
    }

    // Now, delete the WasteType
    await this.wasteTypeRepo.delete(id);

    return {
      message: `The Waste type with ID: ${id} and its associations have been deleted successfully.`,
    };
  }
}
