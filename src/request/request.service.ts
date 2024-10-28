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

  async findOne(id: number) {
    const requestInfo = await this.RequestRepo.findOne({
      where: { id: id },
      relations: ['user', 'department', 'user.profile'],
    });

    if (!requestInfo)
      throw new NotFoundException(
        `The request with #ID: ${id} does not exist.`,
      );
    return requestInfo;
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    const updatedRequest = await this.RequestRepo.update(
      { id: id },
      updateRequestDto,
    );
    return { message: `The request with #ID: ${id} has been updated.` };
  }

  async remove(id: number) {
    // Find the request by ID and include its relations
    const request = await this.RequestRepo.findOne({
      where: { id },
      relations: ['user', 'department'],
    });

    // If the request does not exist, throw an error
    if (!request) {
      throw new NotFoundException(`The request with ID #${id} does not exist.`);
    }

    // Remove associations if needed
    if (request.user) {
      request.user = null;
    }
    if (request.department) {
      request.department = null;
    }

    // Save changes to clear associations
    await this.RequestRepo.save(request);

    // Now remove the request from the database
    await this.RequestRepo.remove(request);

    return {
      message: `The request with ID #${id} has been successfully removed.`,
    };
  }
}
