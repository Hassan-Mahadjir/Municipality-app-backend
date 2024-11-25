import { Module } from '@nestjs/common';
import { AnnoucementService } from './annoucement.service';
import { AnnoucementController } from './annoucement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Department } from 'src/entities/department.entity';
import { Profile } from 'src/entities/profile.entity';
import { Image } from 'src/entities/image.entity';
import { DepartmentService } from 'src/department/department.service';
import { ImageService } from 'src/image/image.service';
import { UserService } from 'src/user/user.service';
import { ProfileService } from 'src/profile/profile.service';
import { Announcement } from 'src/entities/annoucemnet.entity';
import { TranslationService } from 'src/translation/translation.service';
import { AnnouncementTranslation } from 'src/entities/announcementTranslation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Announcement,
      Image,
      User,
      Department,
      Profile,
      AnnouncementTranslation,
    ]),
  ],
  controllers: [AnnoucementController],
  providers: [
    AnnoucementService,
    DepartmentService,
    ImageService,
    UserService,
    ProfileService,
    TranslationService,
  ],
})
export class AnnoucementModule {}
