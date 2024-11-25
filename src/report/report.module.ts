import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
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
      Report,
      User,
      Department,
      Profile,
      ProfileTranslation,
      departmentTranslation,
    ]),
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    UserService,
    DepartmentService,
    ProfileService,
    TranslationService,
  ],
})
export class ReportModule {}
