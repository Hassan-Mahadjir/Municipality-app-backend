import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { ProfileTranslation } from 'src/entities/profileTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User, ProfileTranslation])],
  controllers: [ProfileController],
  providers: [ProfileService, UserService, TranslationService],
})
export class ProfileModule {}
