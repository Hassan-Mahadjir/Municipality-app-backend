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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Request,
      User,
      Department,
      Profile,
      ProfileTranslation,
      departmentTranslation,
    ]),
  ],
  controllers: [RequestController],
  providers: [
    RequestService,
    UserService,
    DepartmentService,
    ProfileService,
    TranslationService,
  ],
})
export class RequestModule {}
