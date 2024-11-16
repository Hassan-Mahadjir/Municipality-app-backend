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
import { PaginationDTO } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';

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

  async findAll(paginationDTO: PaginationDTO) {
    const allServices = await this.departmentRepo.find({
      skip: paginationDTO.skip,
      take: paginationDTO.limit ?? DEFAULT_PAGE_SIZE,
    });
    return { message: 'Status is 200', data: allServices };
  }

  async findDepartment(id: number) {
    return await this.departmentRepo.findOne({ where: { id: id } });
  }

  async findDepartmentbyName(name: string) {
    return await this.departmentRepo.findOne({ where: { name: name } });
  }
}
