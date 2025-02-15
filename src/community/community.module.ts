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
import { WasteSechdule } from 'src/entities/waste-sechdule.entity';
import { WasteType } from 'src/entities/waste-type.entity';
import { Animal } from 'src/entities/animal.entity';
import { AnimalShelter } from 'src/entities/shelter.entity';
import { DisasterPoint } from 'src/entities/disaster-point.entity';
import { ProfileTranslation } from 'src/entities/profileTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';
import { departmentTranslation } from 'src/entities/departmentTranslation.entity';
import { EmergencyContactTranslation } from 'src/entities/emergency-contactTranslations.entity';
import { HistoricalPlaceTranslation } from 'src/entities/historical-pladceTranslation.entity';
import { AnimalTranslation } from 'src/entities/animalTranslation.entity';
import { AnimalShelterTranslation } from 'src/entities/shelterTranslations.entity';
import { WasteSechduleTranslation } from 'src/entities/wasteSechduleTranslation.entity';
import { WasteTypeTranslation } from 'src/entities/waste-typeTranslation.entity';
import { DisasterPointTranslation } from 'src/entities/disaster-pointTranslation.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmergencyContact,
      Image,
      User,
      Department,
      Profile,
      ProfileTranslation,
      WasteSechdule,
      WasteType,
      Animal,
      AnimalShelter,
      DisasterPoint,
      departmentTranslation,
      EmergencyContactTranslation,
      AnimalTranslation,
      AnimalShelterTranslation,
      WasteTypeTranslation,
      WasteSechduleTranslation,
      DisasterPointTranslation,
    ]),
  ],
  controllers: [CommunityController],
  providers: [
    CommunityService,
    DepartmentService,
    ImageService,
    UserService,
    ProfileService,
    TranslationService,
  ],
})
export class CommunityModule {}
