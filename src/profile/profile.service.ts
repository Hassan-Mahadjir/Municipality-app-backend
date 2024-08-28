import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(id: number, createProfileDto: CreateProfileDto) {
    // Get usre object from database
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    //Create new user Profile
    const newUserProfile = this.profileRepo.create({
      ...createProfileDto,
      // Assign user record to the profile
      user: user,
    });

    await this.profileRepo.save(newUserProfile);
    return newUserProfile;
  }

  async findOne(id: number) {
    const userProfile = await this.profileRepo
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('profile.user.id = :id', { id })
      .getOne();
    if (!userProfile) {
      throw new NotFoundException('Profile not found');
    } else return { data: userProfile, message: 'Profile fetched' };
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const result = await this.profileRepo.update(
      { user: { id } },
      updateProfileDto,
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Profile for user with ID ${id} not found.`);
    }

    return this.profileRepo.findOne({ where: { user: { id } } });
    // return result;
  }

  async remove(id: number) {
    return await this.profileRepo.delete({ id: id });
  }
}
