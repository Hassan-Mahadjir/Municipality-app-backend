import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyContact } from 'src/entities/emergency-contact.entity';
import { User } from 'src/entities/user.entity';
import { Department } from 'src/entities/department.entity';
import { Profile } from 'src/entities/profile.entity';
import { Image } from 'src/entities/image.entity';
import { DepartmentService } from 'src/department/department.service';
import { ImageService } from 'src/image/image.service';
import { UserService } from 'src/user/user.service';
import { ProfileService } from 'src/profile/profile.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmergencyContact,
      Image,
      User,
      Department,
      Profile,
    ]),
  ],
  controllers: [CommunityController],
  providers: [
    CommunityService,
    DepartmentService,
    ImageService,
    UserService,
    ProfileService,
  ],
})
export class CommunityModule {}
