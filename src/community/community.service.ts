import {
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

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(EmergencyContact)
    private emergencyRepo: Repository<EmergencyContact>,
    private departmentService: DepartmentService,
    private imageService: ImageService,
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
}
