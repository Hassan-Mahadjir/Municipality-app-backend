import { Module } from '@nestjs/common';
import { TourismService } from './tourism.service';
import { TourismController } from './tourism.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Image } from 'src/entities/image.entity';
import { User } from 'src/entities/user.entity';
import { Department } from 'src/entities/department.entity';
import { Profile } from 'src/entities/profile.entity';
import { DepartmentService } from 'src/department/department.service';
import { ImageService } from 'src/image/image.service';
import { UserService } from 'src/user/user.service';
import { ProfileService } from 'src/profile/profile.service';
import { HistoricalPlace } from 'src/entities/historical-place.entity';
import { ProfileTranslation } from 'src/entities/profileTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';
import { departmentTranslation } from 'src/entities/departmentTranslation.entity';
import { HistoricalPlaceTranslation } from 'src/entities/historical-pladceTranslation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Restaurant,
      Image,
      User,
      Department,
      Profile,
      ProfileTranslation,
      HistoricalPlace,
      departmentTranslation,
      HistoricalPlaceTranslation,
    ]),
  ],
  controllers: [TourismController],
  providers: [
    TourismService,
    DepartmentService,
    ImageService,
    UserService,
    ProfileService,
    TranslationService,
  ],
})
export class TourismModule {}
