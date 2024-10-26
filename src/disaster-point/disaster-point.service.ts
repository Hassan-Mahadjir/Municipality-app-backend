import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDisasterPointDto } from './dto/create-disaster-point.dto';
import { UpdateDisasterPointDto } from './dto/update-disaster-point.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DisasterPoint } from 'src/entities/disaster-point.entity';
import { Repository } from 'typeorm';
import { DepartmentService } from 'src/department/department.service';

@Injectable()
export class DisasterPointService {
  constructor(
    @InjectRepository(DisasterPoint)
    private disasterPointRepo: Repository<DisasterPoint>,
    private departmentService: DepartmentService,
  ) {}
  async create(createDisasterPointDto: CreateDisasterPointDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createDisasterPointDto.departmentName,
    );
    if (!department)
      throw new NotFoundException(
        `The department with ${createDisasterPointDto.departmentName} does not exist.`,
      );

    if (
      createDisasterPointDto.departmentName.toLocaleLowerCase() != 'community'
    )
      throw new UnauthorizedException(
        'The service is not allowed to be assigned here',
      );

    const newDisasterPoint = await this.disasterPointRepo.create({
      ...createDisasterPointDto,
      department: department,
    });

    return await this.disasterPointRepo.save(newDisasterPoint);
  }

  async findAll() {
    return await this.disasterPointRepo.find();
  }

  async findOne(id: number) {
    const point = await this.disasterPointRepo.findOne({ where: { id: id } });
    if (!point)
      throw new NotFoundException(
        `The Disaster point with ID: ${id} does not exist.`,
      );
    return point;
  }

  async update(id: number, updateDisasterPointDto: UpdateDisasterPointDto) {
    const point = await this.disasterPointRepo.findOne({ where: { id: id } });
    if (!point)
      throw new NotFoundException(
        `The Disaster point with ID: ${id} does not exist.`,
      );

    return await this.disasterPointRepo.update({ id }, updateDisasterPointDto);
  }

  remove(id: number) {
    return `This action removes a #${id} disasterPoint`;
  }
}
