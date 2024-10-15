import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/entities/service.entity';
import { Repository } from 'typeorm';
import { DepartmentService } from 'src/department/department.service';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    private departmentService: DepartmentService,
  ) {}

  async create(depId: number, createServiceDto: CreateServiceDto) {
    const department = await this.departmentService.findDepartment(depId);
    const service = await this.serviceRepo.findOneBy({
      name: createServiceDto.name,
    });
    if (!department) throw new NotFoundException('Departmnet is not found');

    if (service)
      throw new UnauthorizedException('This service is in the system.');

    const newService = this.serviceRepo.create({
      ...createServiceDto,
      department: department,
    });
    await this.serviceRepo.save(newService);

    return newService;
  }

  async findDepartmentServices(depId: number) {
    const department = await this.departmentService.findDepartment(depId);
    if (!department)
      throw new NotFoundException(`User with id ${depId} not found`);

    const services = await this.serviceRepo
      .createQueryBuilder('service')
      .innerJoin('service.department', 'department')
      .where('service.department.id = :depId', { depId })
      .getMany(); // Fetch all services related to the department
    return services;
  }

  async findOneService(serviceId: number) {
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['department'],
    });

    if (!service) throw new NotFoundException('Service is not found!');
    return service;
  }
  async update(serviceId: number, updateServiceDto: UpdateServiceDto) {
    // Find the existing service by ID
    const service = await this.findOneService(serviceId);
    if (!service) throw new NotFoundException('Service not found');

    // Find the department by name
    const department = await this.departmentService.findDepartmentbyName(
      updateServiceDto.departmentName,
    );
    if (!department) throw new NotFoundException('Department not found');

    // Update the department and other service fields
    service.department = department;
    Object.assign(service, updateServiceDto); // Merge other fields from DTO

    // Save the updated service entity
    await this.serviceRepo.save(service);

    // Re-fetch the updated service from the database to ensure we return only stored fields
    const updatedService = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['department'],
    });

    return updatedService;
  }

  async delete(serviceId: number) {
    // Find the service to ensure it exists
    const service = await this.findOneService(serviceId);
    if (!service) {
      throw new NotFoundException(`Service with id ${serviceId} not found`);
    }

    // Revoke the relationship between service and department
    service.department = null;
    await this.serviceRepo.save(service); // Save the service without the department relationship

    // Now delete the service
    await this.serviceRepo.delete(serviceId);

    return {
      message: `Service with id ${serviceId} has been successfully deleted and the department relationship revoked`,
    };
  }
}
