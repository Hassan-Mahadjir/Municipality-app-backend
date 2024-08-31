import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/entities/department.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
    private userService: UserService,
  ) {}

  async create(
    responsibleId: number,
    createDepartmentDto: CreateDepartmentDto,
  ) {
    const user = await this.userService.findOne(responsibleId);
    if (!user) throw new NotFoundException('User is not found');

    if (user)
      throw new UnauthorizedException(
        'The user is already resposible for a department',
      );

    if (user.role !== 'STAFF') {
      throw new UnauthorizedException(
        'User is not authorized to be resposible',
      );
    }

    const newDepartment = this.departmentRepo.create({
      ...createDepartmentDto,
      responsible: user,
    });
    await this.departmentRepo.save(newDepartment);
    return newDepartment;
  }

  async findAll() {
    const allServices = await this.departmentRepo.find();
    return { message: 'Status is 200', data: allServices };
  }
}
