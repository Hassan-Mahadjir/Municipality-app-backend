import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'src/entities/request.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { DepartmentService } from 'src/department/department.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request) private RequestRepo: Repository<Request>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private userService: UserService,
    private departmentService: DepartmentService,
  ) {}

  async create(createRequestDto: CreateRequestDto, id: number) {
    const user = await this.userService.findOne(id);
    const department = await this.departmentService.findDepartmentbyName(
      createRequestDto.departmentName,
    );

    if (!user)
      throw new NotFoundException(`The user with #ID: ${id} does not exist.`);

    if (!department)
      throw new NotFoundException(
        `The department ${createRequestDto.departmentName} does not exist.`,
      );

    const newRequest = this.RequestRepo.create({
      subject: createRequestDto.subject,
      location: createRequestDto.location,
      message: createRequestDto.message,
      department: department,
      user: user,
    });

    return await this.RequestRepo.save(newRequest);
  }

  async findAll() {
    const requests = await this.RequestRepo.find({
      relations: ['user', 'department'],
    });
    return requests;
  }

  async findUserRequests(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['requests'],
    });
    return user;
  }

  findOne(id: number) {
    return;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
