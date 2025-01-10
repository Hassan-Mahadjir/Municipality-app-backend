import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTO } from 'src/department/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { ProfileService } from 'src/profile/profile.service';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import passport from 'passport';
import { Role } from 'src/auth/enums/role.enums';

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
    try {
      const user = this.userRepo.create(createUserDto);
      await this.userRepo.save(user);
      if (createProfileDto) {
        const userProile = this.profileSrevice.create(
          user.id,
          createProfileDto,
        );
      }
      return { message: 'The user is created successfully', data: user };
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL error code for unique constraint violation
        throw new ConflictException('Email already exists.');
      }
      throw error;
    }
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
    const userProfile = await this.profileSrevice.findOne(id);
    const profileId = userProfile.data.id;
    // Delete user profile
    await this.profileSrevice.remove(profileId);
    // Delete user's account
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

  async getUser(id: number) {
    const user = await this.userRepo.findOne({
      where: { id: id },
      relations: ['profile', 'profile.translation'],
    });
    if (!user)
      throw new NotFoundException(`The user with ID:${id} does not exist`);
    return { message: `User has been fetched successfully.`, data: user };
  }

  async getResposibles() {
    const resposibles = await this.userRepo.find({
      where: { role: Role.STAFF },
      relations: ['profile', 'profile.translation'],
    });

    return {
      message: 'Resposible have been fetched successfully.',
      data: resposibles,
    };
  }

  async getUsers() {
    const resposibles = await this.userRepo.find({
      relations: ['profile', 'profile.translation'],
    });

    return {
      message: 'Users have been fetched successfully.',
      data: resposibles,
    };
  }
}
