import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTO } from 'src/user/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { ProfileService } from 'src/profile/profile.service';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import passport from 'passport';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private profileSrevice: ProfileService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    createProfileDto?: CreateProfileDto,
  ) {
    const user = this.userRepo.create(createUserDto);
    await this.userRepo.save(user);

    if (createProfileDto) {
      const userProile = this.profileSrevice.create(user.id, createProfileDto);
    }
    return user;
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
      select: ['id', 'role', 'email', 'password', 'hashedRefreshToken'],
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

  async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
    return await this.userRepo.update(
      { id: userId },
      { hashedRefreshToken: hashedRefreshToken },
    );
  }

  async updateHashedPassword(userId: number, newHashedPassword: string) {
    return await this.userRepo.update(
      { id: userId },
      { password: newHashedPassword },
    );
  }
}
