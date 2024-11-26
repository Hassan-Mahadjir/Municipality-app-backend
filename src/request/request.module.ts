import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'src/entities/request.entity';
import { User } from 'src/entities/user.entity';
import { Department } from 'src/entities/department.entity';
import { Profile } from 'src/entities/profile.entity';
import { UserService } from 'src/user/user.service';
import { DepartmentService } from 'src/department/department.service';
import { ProfileService } from 'src/profile/profile.service';
import { ProfileTranslation } from 'src/entities/profileTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';
import { departmentTranslation } from 'src/entities/departmentTranslation.entity';
import { Image } from 'src/entities/image.entity';
import { RequestTranslation } from 'src/entities/requestTranslation.entity';
import { ImageService } from 'src/image/image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Request,
      User,
      Department,
      Profile,
      ProfileTranslation,
      departmentTranslation,
      Image,
      RequestTranslation,
    ]),
  ],
  controllers: [RequestController],
  providers: [
    RequestService,
    UserService,
    DepartmentService,
    ProfileService,
    TranslationService,
    ImageService,
  ],
})
export class RequestModule {}
