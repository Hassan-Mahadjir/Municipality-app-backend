import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async findAllUsers() {
    return await this.userRepo.find();
  }
  async findUser(userId: number) {
    const user = await this.userRepo.findOne({
      where: {
        userId: userId,
      },
    });

    if (!user) throw new NotFoundException();
    return user;
  }
  async createUser(dto: CreateUserDto) {
    return await this.userRepo.save(dto);
  }
  async updateUser(userId: number, dto: UpdateUserDto) {
    return await this.userRepo.update({ userId }, dto);
  }
  async deleteUser(userId: number) {
    return await this.userRepo.delete({
      userId: userId,
    });
  }
}
