import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTO } from 'src/user/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);

    return await this.userRepo.save(user);
  }

  async findAll(paginationDTO: PaginationDTO) {
    return await this.userRepo.find({
      skip: paginationDTO.skip,
      take: paginationDTO.limit ?? DEFAULT_PAGE_SIZE,
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepo.update({ id }, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepo.delete({
      id: id,
    });
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({
      where: {
        email: email,
      },
    });
  }
}
