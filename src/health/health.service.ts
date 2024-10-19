import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pharmacy } from 'src/entities/pharmacy.entity';
import { Repository } from 'typeorm';
import { Hospital } from 'src/entities/hospitals.entity';
import { CreatePharmacyDto } from 'src/health/dto/create-pharmacy.dto';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdatePharmacyDto } from 'src/health/dto/update-pharmacy.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { DepartmentService } from 'src/department/department.service';
@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(Pharmacy) private pharmacyRepo: Repository<Pharmacy>,
    @InjectRepository(Hospital) private hospitalRepo: Repository<Hospital>,
    private departmentService: DepartmentService,
  ) {}
  async createPharmacy(createPharmacyDto: CreatePharmacyDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createPharmacyDto.departmetName,
    );
    if (!department)
      throw new NotFoundException(
        `The department with ${createPharmacyDto.departmetName} does not exists.`,
      );

    if (createPharmacyDto.departmetName.toLocaleLowerCase() != 'health')
      throw new UnauthorizedException(
        'The service is not allowed to be assigned here',
      );

    const newPharmacy = await this.pharmacyRepo.create({
      ...createPharmacyDto,
      department: department,
    });

    return this.pharmacyRepo.save(newPharmacy);
  }

  findAllPharmacy() {
    return this.pharmacyRepo.find();
  }

  findOnePharmacy(id: number) {
    return this.pharmacyRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  async updatePharmcay(id: number, updatePharmacyDto: UpdatePharmacyDto) {
    return this.pharmacyRepo.update({ id }, updatePharmacyDto);
  }

  removePharmacy(id: number) {
    return this.pharmacyRepo.delete(id);
  }

  async createHospital(createHospitalDto: CreateHospitalDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createHospitalDto.departmetName,
    );
    if (!department)
      throw new NotFoundException(
        `The department with ${createHospitalDto.departmetName} does not exists.`,
      );

    if (createHospitalDto.departmetName.toLocaleLowerCase() != 'health')
      throw new UnauthorizedException(
        'The service is not allowed to be assigned here',
      );

    const newHospital = await this.hospitalRepo.create({
      ...createHospitalDto,
      department: department,
    });

    return this.hospitalRepo.save(newHospital);
    // return this.hospitalRepo.save(CreateHospitalDto);
  }

  findAllHospital() {
    return this.hospitalRepo.find();
  }

  findOneHospital(id: number) {
    return this.hospitalRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  updateHospital(id: number, UpdateHospitalDto: UpdateHospitalDto) {
    return this.hospitalRepo.update({ id }, UpdateHospitalDto);
  }

  removeHospital(id: number) {
    return this.hospitalRepo.delete(id);
  }
}
