import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileTranslation } from 'src/entities/profileTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ProfileTranslation)
    private profileTranslationRepo: Repository<ProfileTranslation>,
    private translationService: TranslationService,
  ) {}

  async create(id: number, createProfileDto: CreateProfileDto) {
    // Get usre object from database
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    //Create new user Profile  and save it
    const newUserProfile = this.profileRepo.create({
      ...createProfileDto,
      // Assign user record to the profile
      user: user,
    });
    await this.profileRepo.save(newUserProfile);
    // Define target Languages
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createProfileDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    // Translate content for each target language
    for (const targetLang of targetLanguages) {
      const translatedDescription = createProfileDto.description
        ? await this.translationService.translateText(
            createProfileDto.description,
            targetLang,
          )
        : null;

      const translatedGender = createProfileDto.gender
        ? await this.translationService.translateText(
            createProfileDto.gender,
            targetLang,
          )
        : null;

      // Save each translation
      const translatedTranslation = this.profileTranslationRepo.create({
        gender: translatedGender,
        description: translatedDescription,
        language: targetLang,
        profile: newUserProfile,
      });

      await this.profileTranslationRepo.save(translatedTranslation);
    }

    return {
      message: 'User Profile created successfully.',
      data: {
        newUserProfile,
      },
    };
  }

  async findOne(id: number) {
    const userProfile = await this.profileRepo
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndSelect('profile.translation', 'translation')
      .where('profile.user.id = :id', { id })
      .getOne();
    if (!userProfile) {
      throw new NotFoundException('Profile not found');
    } else return { data: userProfile, message: 'Profile fetched' };
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    // Step 1: Update the Profile entity
    const result = await this.profileRepo.update(
      { user: { id } },
      updateProfileDto,
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Profile for user with ID ${id} not found.`);
    }

    // Step 2: Fetch the updated profile
    const updatedProfile = await this.profileRepo.findOne({
      where: { user: { id } },
      relations: ['translation'], // Ensure translations are fetched
    });

    if (!updatedProfile) {
      throw new NotFoundException(
        `Updated profile not found for user ID ${id}`,
      );
    }

    // Step 3: Update translations for target languages
    const allLanguages = ['EN', 'TR']; // Example: English and Turkish
    const sourceLang = updatedProfile.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    for (const targetLang of targetLanguages) {
      // Translate fields if present in update DTO
      const translatedDescription = updateProfileDto.description
        ? await this.translationService.translateText(
            updateProfileDto.description,
            targetLang,
          )
        : null;

      const translatedGender = updateProfileDto.gender
        ? await this.translationService.translateText(
            updateProfileDto.gender,
            targetLang,
          )
        : null;

      // Update or create translation record
      const existingTranslation = await this.profileTranslationRepo.findOne({
        where: { profile: { id: updatedProfile.id }, language: targetLang },
      });

      if (existingTranslation) {
        // Update existing translation
        await this.profileTranslationRepo.update(existingTranslation.id, {
          gender: translatedGender ?? existingTranslation.gender,
          description: translatedDescription ?? existingTranslation.description,
        });
      } else {
        // Create new translation
        const newTranslation = this.profileTranslationRepo.create({
          profile: updatedProfile,
          language: targetLang,
          gender: translatedGender,
          description: translatedDescription,
        });
        await this.profileTranslationRepo.save(newTranslation);
      }
    }

    // Step 4: Return the updated profile with translations
    return await this.profileRepo.findOne({
      where: { user: { id } },
      relations: ['translation'], // Include updated translations
    });
  }

  async remove(id: number) {
    // Fetch the profile with its translation
    const profile = await this.profileRepo.findOne({
      where: { id },
      relations: ['translation'], // Ensure that the translation relation is fetched
    });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found.`);
    }

    // If the profile has a translation, delete it
    if (profile.translation) {
      await this.profileTranslationRepo.delete(profile.translation.id);
    }

    // Delete the profile itself
    return await this.profileRepo.delete(id);
  }
}
