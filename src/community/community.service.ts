import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEmergencyContactDto } from './dto/create-emergency-contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-emergency-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmergencyContact } from 'src/entities/emergency-contact.entity';
import { Repository } from 'typeorm';
import { DepartmentService } from 'src/department/department.service';
import { ImageService } from 'src/image/image.service';
import { UpdateSechduleDto } from 'src/bus/dto/update-sechdule.dto';
import { UpdateWasteSechduleDto } from './dto/update-waste-sechdule.dto';
import { WasteType } from 'src/entities/waste-type.entity';
import { WasteSechdule } from 'src/entities/waste-sechdule.entity';
import { CreateWasteTypeDto } from './dto/create-waste-type.dto';
import { UpdateWasteTypeDto } from './dto/update-waste-type.dto';
import { CreateWasteSechduleDto } from './dto/create-waste-sechdule.dto';
import { Animal } from 'src/entities/animal.entity';
import { User } from 'src/entities/user.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Image } from 'src/entities/image.entity';
import { AnimalShelter } from 'src/entities/shelter.entity';
import { CreateAnimalShelterDto } from './dto/create-animal-shelter.dto';
import { UpdateAnimalShelterDto } from './dto/update-animal-shelter.dto';
import { CreateDisasterPointDto } from './dto/create-disaster-point.dto';
import { DisasterPoint } from 'src/entities/disaster-point.entity';
import { UpdateDisasterPointDto } from './dto/update-disaster-point.dto';
import { TranslationService } from 'src/translation/translation.service';
import { EmergencyContactTranslation } from 'src/entities/emergency-contactTranslations.entity';
import { AnimalTranslation } from 'src/entities/animalTranslation.entity';
import { AnimalShelterTranslation } from 'src/entities/shelterTranslations.entity';
import { WasteSechduleTranslation } from 'src/entities/wasteSechduleTranslation.entity';
import { WasteTypeTranslation } from 'src/entities/waste-typeTranslation.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(EmergencyContact)
    private emergencyRepo: Repository<EmergencyContact>,
    private departmentService: DepartmentService,
    private imageService: ImageService,
    @InjectRepository(WasteType) private wasteTypeRepo: Repository<WasteType>,
    @InjectRepository(WasteSechdule)
    private wasteSechduleRepo: Repository<WasteSechdule>,
    @InjectRepository(Animal) private animalRepo: Repository<Animal>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(AnimalShelter)
    private animalShelterRepo: Repository<AnimalShelter>,
    @InjectRepository(DisasterPoint)
    private disasterPointRepo: Repository<DisasterPoint>,
    private translationService: TranslationService,
    @InjectRepository(EmergencyContactTranslation)
    private emergencyTranslationsReppo: Repository<EmergencyContactTranslation>,
    @InjectRepository(AnimalTranslation)
    private animalTranslationRepo: Repository<AnimalTranslation>,
    @InjectRepository(AnimalShelterTranslation)
    private animalShelterTranslationRepo: Repository<AnimalShelterTranslation>,
    @InjectRepository(WasteSechduleTranslation)
    private wasteSechduleTranslationRepo: Repository<WasteSechduleTranslation>,
    @InjectRepository(WasteTypeTranslation)
    private wasteTypeTranslationRepo: Repository<WasteTypeTranslation>,
  ) {}
  async createEmergencyContact(
    createEmergencyContactDto: CreateEmergencyContactDto,
  ) {
    const department = await this.departmentService.findDepartmentbyName(
      createEmergencyContactDto.departmentName,
    );

    if (!department)
      throw new NotFoundException(
        `The department ${createEmergencyContactDto.departmentName} does not exist.`,
      );

    if (createEmergencyContactDto.departmentName.toLowerCase() !== 'community')
      throw new UnauthorizedException(
        `The service is not allowed to assign here.`,
      );

    // Check for existing contact with the same phone number or name
    const existingContact = await this.emergencyRepo.findOne({
      where: [
        { phone: createEmergencyContactDto.phone },
        { name: createEmergencyContactDto.name },
      ],
    });

    if (existingContact) {
      throw new ConflictException(
        'An emergency contact with this phone number or name already exists.',
      );
    }

    const newContact = this.emergencyRepo.create({
      ...createEmergencyContactDto,
      language: createEmergencyContactDto.language,
      department: department,
    });

    const newContactInfo = await this.emergencyRepo.save(newContact);

    // Step 4: Define target languages
    const allLanguages = ['EN', 'TR']; // Example: English, Turkish
    const sourceLang = createEmergencyContactDto.language; // Original language
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang); // Exclude original language

    for (const targetLang of targetLanguages) {
      const translatedName = createEmergencyContactDto.name
        ? await this.translationService.translateText(
            createEmergencyContactDto.name,
            targetLang,
          )
        : null;

      const translatedTranslation = this.emergencyTranslationsReppo.create({
        name: translatedName,
        language: targetLang,
        emergencyContact: newContact,
      });

      await this.emergencyTranslationsReppo.save(translatedTranslation);
    }

    return {
      message: 'Emergency contact has been created successfullly.',
      data: newContactInfo,
    };
  }

  async findAllEmergencyContacts() {
    const emergencyContacts = await this.emergencyRepo.find({
      relations: ['translations'],
    });
    return {
      messsage: `${emergencyContacts.length} has been fetched succcessfully.`,
      data: emergencyContacts,
    };
  }

  async findOneEmergencyContact(id: number) {
    const contactInfo = await this.emergencyRepo.findOne({
      where: { id: id },
      relations: ['translations'],
    });
    if (!contactInfo)
      throw new NotFoundException(
        `The emergenecy contact with ID:${id} does not exit.`,
      );

    return {
      message: `Emergency contact info has been fetched successfully.`,
      data: contactInfo,
    };
  }

  async updateEmergencyContact(
    id: number,
    updateEmergencyContactDto: UpdateEmergencyContactDto,
  ) {
    const emergencyContact = await this.emergencyRepo.findOne({
      where: { id: id },
      relations: ['translations'],
    });
    if (!emergencyContact)
      throw new NotFoundException(
        `The Emergency contact with ID:${id} does not exist.`,
      );

    Object.assign(emergencyContact, updateEmergencyContactDto);

    if (updateEmergencyContactDto.name) {
      const allLanguages = ['EN', 'TR']; // Add other supported languages here
      const sourceLang =
        updateEmergencyContactDto.language || emergencyContact.language;

      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        const existingTranslation = emergencyContact.translations.find(
          (translation) => translation.language === targetLang,
        );

        const translatedName = updateEmergencyContactDto.name
          ? await this.translationService.translateText(
              updateEmergencyContactDto.name,
              targetLang,
            )
          : existingTranslation.name;

        if (existingTranslation) {
          Object.assign(existingTranslation, {
            name: translatedName || existingTranslation.name,
          });
        } else {
          const newTranslation = this.emergencyTranslationsReppo.create({
            name: translatedName || 'Translations unavailable',
            language: targetLang,
            emergencyContact: emergencyContact,
          });

          emergencyContact.translations.push(newTranslation);
        }
      }

      for (const translation of emergencyContact.translations) {
        await this.emergencyTranslationsReppo.save(translation);
      }
    }

    const updateEmergencyContact =
      await this.emergencyRepo.save(emergencyContact);
    return {
      message: `The emergency contacted with ID:${id} has been updated successfully.`,
    };
  }

  async removeEmergencyContact(id: number) {
    const emergencyContact = await this.emergencyRepo.findOne({
      where: { id: id },
      relations: ['translations'],
    });
    if (!emergencyContact)
      throw new NotFoundException(
        `The Emergency contact with ID:${id} does not exist.`,
      );

    if (emergencyContact.translations.length > 0) {
      for (const translation of emergencyContact.translations) {
        await this.emergencyTranslationsReppo.remove(translation);
      }
    }
    emergencyContact.department = null;

    await this.emergencyRepo.remove(emergencyContact);

    return {
      message: `Emergency contact with ID:${id} have been removed successfully.`,
    };
  }

  async createWasteType(createWasteTypeDto: CreateWasteTypeDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createWasteTypeDto.departmentName,
    );
    const type = await this.wasteTypeRepo.findOne({
      where: { type: createWasteTypeDto.type },
    });

    if (type)
      throw new ConflictException(
        `The type:${createWasteTypeDto.type} is in the database.`,
      );
    if (!department)
      throw new NotFoundException(
        `The department ${createWasteTypeDto.departmentName} does not exist.`,
      );

    if (createWasteTypeDto.departmentName.toLowerCase() !== 'community')
      throw new UnauthorizedException(
        `The service is not allowed to assign here.`,
      );

    const newType = await this.wasteTypeRepo.create({
      type: createWasteTypeDto.type,
      language: createWasteTypeDto.language,
      department: department,
    });

    const savedType = await this.wasteTypeRepo.save(newType);

    // Define target languages
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createWasteTypeDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    // Create translations for target languages
    for (const targetLang of targetLanguages) {
      const translatedType = createWasteTypeDto.type
        ? await this.translationService.translateText(
            createWasteTypeDto.type,
            targetLang,
          )
        : null;

      const translatedTranslation = await this.wasteTypeTranslationRepo.create({
        type: translatedType,
        language: targetLang,
        wasteType: savedType,
      });

      await this.wasteTypeTranslationRepo.save(translatedTranslation);
    }

    return {
      message: `Waste type has been created successfully.`,
      data: savedType,
    };
  }

  async modifyWasteType(id: number, updateWasteTypeDto: UpdateWasteTypeDto) {
    const wasteType = await this.wasteTypeRepo.findOne({
      where: { id: id },
      relations: ['translations'],
    });
    if (!wasteType)
      throw new NotFoundException(
        `The waste type with #ID:${id} does not exist.`,
      );

    Object.assign(wasteType, updateWasteTypeDto);

    if (updateWasteTypeDto.type) {
      const allLanguages = ['EN', 'TR'];
      const sourceLang = updateWasteTypeDto.language || wasteType.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        let existingTranslation = wasteType.translations.find(
          (translation) => translation.language === targetLang,
        );

        const translatedType = await this.translationService.translateText(
          updateWasteTypeDto.type,
          targetLang,
        );

        if (existingTranslation) {
          Object.assign(existingTranslation, { type: translatedType });
          await this.wasteTypeTranslationRepo.save(existingTranslation);
        } else {
          const newTranslation = this.wasteTypeTranslationRepo.create({
            type: translatedType || 'Translation unavailable',
            language: targetLang,
            wasteType: wasteType,
          });
          await this.wasteTypeTranslationRepo.save(newTranslation);
          wasteType.translations.push(newTranslation); // Optional: maintain local consistency
        }
      }
    }

    const updatedWasteType = await this.wasteTypeRepo.save(wasteType);

    return {
      message: `The waste type with #ID ${id} has been updated successfully.`,
    };
  }

  async createWasteSechdule(createWasteSechduleDto: CreateWasteSechduleDto) {
    const type = await this.wasteTypeRepo.findOne({
      where: { type: createWasteSechduleDto.wasteType },
    });

    if (!type) {
      throw new NotFoundException(
        `The type: ${createWasteSechduleDto.wasteType} does not exist.`,
      );
    }

    // Check for duplicate days in the array
    const days = createWasteSechduleDto.days.map((item) =>
      item.day.toLowerCase(),
    );
    const uniqueDays = new Set(days);

    if (uniqueDays.size !== days.length) {
      throw new BadRequestException('Duplicate days found in the schedule.');
    }

    // Save each unique schedule to the database
    for (const item of createWasteSechduleDto.days) {
      const newSechdule = await this.wasteSechduleRepo.create({
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
        wasteType: type,
        language: createWasteSechduleDto.language,
      });

      const savedSechdule = await this.wasteSechduleRepo.save(newSechdule);
      // Define target languages
      const allLanguages = ['EN', 'TR'];
      const sourceLang = createWasteSechduleDto.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      // Create translations for target languages
      for (const targetLang of targetLanguages) {
        const translatedDay = item.day
          ? await this.translationService.translateText(item.day, targetLang)
          : null;
        const translatedTranslation = this.wasteSechduleTranslationRepo.create({
          day: translatedDay,
          language: targetLang,
          wasteSechdule: savedSechdule,
        });

        await this.wasteSechduleTranslationRepo.save(translatedTranslation);
      }
    }

    return { message: `The schedules have been created successfully.` };
  }

  async getAllWasteSechdule() {
    const allSechdules = await this.wasteTypeRepo.find({
      relations: ['sechdules', 'sechdules.translations', 'translations'],
    });

    return {
      message: `Successfully fetched ${allSechdules.length} types with the sechdules`,
      data: allSechdules,
    };
  }

  async updateWasteSechdule(
    id: number,
    updateWasteSechduleDto: UpdateWasteSechduleDto,
  ) {
    // Validate that the WasteType exists if provided
    if (updateWasteSechduleDto.wasteType) {
      const wasteType = await this.wasteTypeRepo.findOne({
        where: { type: updateWasteSechduleDto.wasteType },
      });
      if (!wasteType) {
        throw new NotFoundException(
          `Waste type '${updateWasteSechduleDto.wasteType}' not found.`,
        );
      }
    }

    // Check if any days are provided
    if (
      !updateWasteSechduleDto.days ||
      updateWasteSechduleDto.days.length === 0
    ) {
      throw new BadRequestException('No days provided to update.');
    }

    // Delete existing schedules for the given wasteType
    const existingSchedules = await this.wasteSechduleRepo.find({
      where: { wasteType: { id } },
      relations: ['translations'],
    });

    for (const existingSchedule of existingSchedules) {
      // Delete associated translations first
      await this.wasteSechduleTranslationRepo.remove(
        existingSchedule.translations,
      );

      await this.wasteSechduleRepo.remove(existingSchedule); // Delete the existing schedule
    }

    // Create new schedules
    for (const daySchedule of updateWasteSechduleDto.days) {
      const newSechdule = this.wasteSechduleRepo.create({
        day: daySchedule.day,
        startTime: daySchedule.startTime,
        endTime: daySchedule.endTime,
        language: updateWasteSechduleDto.language || 'EN',
        wasteType: await this.wasteTypeRepo.findOne({
          where: { type: updateWasteSechduleDto.wasteType },
        }),
      });

      const newSavedSechdule = await this.wasteSechduleRepo.save(newSechdule);

      // Assuming you have predefined languages
      const allLanguages = ['EN', 'TR'];
      const sourceLang = updateWasteSechduleDto.language || 'EN';
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        const translatedDay = daySchedule.day
          ? await this.translationService.translateText(
              daySchedule.day,
              targetLang,
            )
          : daySchedule.day;

        const newTranslation = this.wasteSechduleTranslationRepo.create({
          day: translatedDay,
          language: targetLang,
          wasteSechdule: newSavedSechdule,
        });

        await this.wasteSechduleTranslationRepo.save(newTranslation);
      }
    }

    return { message: `The schedules have been updated successfully.` };
  }

  async deleteWasteType(id: number) {
    // Find the WasteType by ID, including related schedules and translations
    const wasteType = await this.wasteTypeRepo.findOne({
      where: { id },
      relations: ['sechdules', 'sechdules.translations', 'translations'], // Load schedules with translations
    });

    if (!wasteType) {
      throw new NotFoundException(`Waste type with ID '${id}' not found.`);
    }

    // Remove associated translations for each schedule
    if (wasteType.sechdules.length > 0) {
      for (const sechdule of wasteType.sechdules) {
        // Delete associated translations first
        if (sechdule.translations && sechdule.translations.length > 0) {
          await this.wasteSechduleTranslationRepo.remove(sechdule.translations); // Delete translations first
        }

        // Now delete the schedule itself
        await this.wasteSechduleRepo.remove(sechdule);
      }
    }

    // Remove associated translations for the WasteType itself (if any)
    if (wasteType.translations && wasteType.translations.length > 0) {
      await this.wasteTypeTranslationRepo.remove(wasteType.translations);
    }

    // Finally, delete the WasteType
    await this.wasteTypeRepo.delete(id);

    return {
      message: `The Waste type with ID: ${id} and its associations have been deleted successfully.`,
    };
  }

  // ANIMAL SERVICE
  async CreateAnimalReport(id: number, createAnimalDto: CreateAnimalDto) {
    // Find the department
    const department =
      await this.departmentService.findDepartmentbyName('Community');
    if (!department) {
      throw new NotFoundException(`The department 'Community' does not exist.`);
    }

    // Find the user
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`The user with ID: ${id} does not exist.`);
    }

    // Initialize an array to store image entities
    const images: Image[] = [];

    // Iterate over image URLs and create each image
    for (const imageUrl of createAnimalDto.imageUrls) {
      const image = await this.imageService.create(imageUrl);
      if (image) {
        images.push(image);
      }
    }
    // Translate the default status into the report's language
    const translatedStatus = await this.translationService.translateText(
      'Lost',
      createAnimalDto.language,
    );

    // Create the new animal report with associated images
    const newReport = this.animalRepo.create({
      title: createAnimalDto.title,
      status: translatedStatus || 'Lost',
      description: createAnimalDto.description,
      contactInfo: createAnimalDto.contactInfo,
      location: createAnimalDto.location,
      department: department,
      language: createAnimalDto.language,
      user: user,
      images: images, // Associate the images with the report
    });

    const savedAnimalReport = await this.animalRepo.save(newReport);

    // Define target languages
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createAnimalDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    for (const targetLang of targetLanguages) {
      const translatedTitle = createAnimalDto.title
        ? await this.translationService.translateText(
            createAnimalDto.title,
            targetLang,
          )
        : null;
      const translatedLocation = createAnimalDto.location
        ? await this.translationService.translateText(
            createAnimalDto.location,
            targetLang,
          )
        : null;
      const translatedDescription = createAnimalDto.description
        ? await this.translationService.translateText(
            createAnimalDto.description,
            targetLang,
          )
        : null;
      const targetStatus = await this.translationService.translateText(
        'Lost',
        targetLang,
      );

      const translatedTranslation = this.animalTranslationRepo.create({
        status: targetStatus || translatedStatus || 'Lost',
        title: translatedTitle,
        location: translatedLocation,
        description: translatedDescription,
        language: targetLang,
        animal: savedAnimalReport,
      });

      await this.animalTranslationRepo.save(translatedTranslation);

      return {
        message: 'Animal report has been created sluccessfylly.',
        data: savedAnimalReport,
      };
    }
  }

  async findAinmalReport(id: number) {
    const animalReport = await this.animalRepo.findOne({
      where: { id: id },
      relations: ['department', 'user.profile', 'images', 'translations'],
    });

    if (!animalReport)
      throw new NotFoundException(`The Animal with ${id} does not exist.`);

    return {
      message: `Animal report has been fetched successfully.`,
      data: animalReport,
    };
  }

  async findAllAnimalReport() {
    const allAnimalReport = await this.animalRepo.find({
      relations: ['department', 'user.profile', 'images', 'translations'],
    });

    return {
      messsage: `Successfully fetched ${allAnimalReport.length} animal reports.`,
      data: allAnimalReport,
    };
  }

  async updateAnimalReport(id: number, updateAnimalDto: UpdateAnimalDto) {
    const animalReport = await this.animalRepo.findOne({
      where: { id: id },
      relations: ['department', 'user.profile', 'images', 'translations'],
    });

    if (!animalReport) {
      throw new NotFoundException(
        `The Animal report with ID: ${id} does not exist.`,
      );
    }

    const user = await this.userRepo.findOne({
      where: { id: updateAnimalDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `The user with ID: ${updateAnimalDto.userId} does not exist.`,
      );
    }

    // Optional: Check if the animal report is associated with the current user
    if (animalReport.user.id !== updateAnimalDto.userId) {
      throw new ForbiddenException(
        `You do not have permission to update this animal report.`,
      );
    }

    // Remove old images if new images are provided
    if (updateAnimalDto.imageUrls) {
      // Check if there are existing images before attempting to delete
      if (animalReport.images && animalReport.images.length > 0) {
        const oldImageIds = animalReport.images.map((image) => image.id);
        await this.imageService.deleteImages(oldImageIds);
      }

      // Add new images
      const newImages = [];
      for (const imageUrl of updateAnimalDto.imageUrls) {
        const image = await this.imageService.create(imageUrl);
        if (image) {
          newImages.push(image);
        }
      }
      animalReport.images = newImages;
    }

    // Merge updateAnimalDto properties into the existing animalReport object
    Object.assign(animalReport, updateAnimalDto);

    if (
      updateAnimalDto.description ||
      updateAnimalDto.location ||
      updateAnimalDto.status ||
      updateAnimalDto.title
    ) {
      // Define target languages
      const allLanguages = ['EN', 'TR'];
      const sourceLang = updateAnimalDto.language || animalReport.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        let existingTranslation = animalReport.translations.find(
          (translation) => translation.language === targetLang,
        );

        // Translate fields if provided in the update DTO
        const translatedTitle = updateAnimalDto.title
          ? await this.translationService.translateText(
              updateAnimalDto.title,
              targetLang,
            )
          : existingTranslation.title;
        const translatedLocation = updateAnimalDto.location
          ? await this.translationService.translateText(
              updateAnimalDto.location,
              targetLang,
            )
          : existingTranslation.location;
        const translatedDescription = updateAnimalDto.description
          ? await this.translationService.translateText(
              updateAnimalDto.description,
              targetLang,
            )
          : existingTranslation.description;

        const translatedStatus = updateAnimalDto.status
          ? await this.translationService.translateText(
              updateAnimalDto.status,
              targetLang,
            )
          : existingTranslation?.status;

        if (existingTranslation) {
          // Update the existing translation
          Object.assign(existingTranslation, {
            title: translatedTitle,
            description: translatedDescription,
            status: translatedStatus,
            location: translatedLocation,
          });
        } else {
          // create a new translation if doesn't exist
          existingTranslation = this.animalTranslationRepo.create({
            title: translatedTitle || 'Translations unavailable',
            location: translatedLocation || 'Translations unavailable',
            description: translatedDescription || `Transaltion unavailable`,
            status: translatedStatus || 'Translation unavailable',
            language: targetLang,
            animal: animalReport,
          });

          animalReport.translations.push(existingTranslation);
        }

        // Save the translation
        await this.animalTranslationRepo.save(existingTranslation);
      }
    }

    // Save the updated animalReport entity with new images
    const updatedAnimalReport = await this.animalRepo.save(animalReport);

    return {
      message: `The Animal report with ID: ${id} has been updated successfully.`,
    };
  }

  async deleteAnimalReport(id: number) {
    const animalReport = await this.animalRepo.findOne({
      where: { id: id },
      relations: ['department', 'user.profile', 'images', 'translations'], // Include images in relations
    });

    if (!animalReport) {
      throw new NotFoundException(
        `The Animal report with ID: ${id} does not exist.`,
      );
    }

    // Delete associated images if they exist
    if (animalReport.images && animalReport.images.length > 0) {
      const imageIds = animalReport.images.map((image) => image.id);
      await this.imageService.deleteImages(imageIds);
    }

    // Remove associated translations
    if (animalReport.translations?.length > 0) {
      for (const translation of animalReport.translations) {
        await this.animalTranslationRepo.remove(translation);
      }
    }

    // Remove the association with department and user by setting them to null
    animalReport.department = null;
    animalReport.user = null;

    // Save changes to clear associations
    await this.animalRepo.save(animalReport);

    // Now remove the animal report itself
    await this.animalRepo.remove(animalReport);

    return {
      message: `The Animal report with ID: ${id} and its associated images have been deleted successfully.`,
    };
  }

  async createAnimalShelter(createAnimalShelterDto: CreateAnimalShelterDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createAnimalShelterDto.departmentName,
    );
    if (!department)
      throw new NotFoundException(
        `The department ${createAnimalShelterDto.departmentName} does not exist.`,
      );

    if (department.name.toLocaleLowerCase() != 'community')
      throw new UnauthorizedException(
        `The service is not allowed to assign here.`,
      );

    const newShelter = await this.animalShelterRepo.create({
      ...createAnimalShelterDto,
      department: department,
    });

    const savedShelter = await this.animalShelterRepo.save(newShelter);
    // Define target languages
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createAnimalShelterDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    // Create translations for target languages
    for (const targetLang of targetLanguages) {
      const translatedLocation = createAnimalShelterDto.location
        ? await this.translationService.translateText(
            createAnimalShelterDto.location,
            targetLang,
          )
        : null;

      const translatedTranslation = this.animalShelterTranslationRepo.create({
        location: translatedLocation,
        language: targetLang,
        animalShelter: savedShelter,
      });

      await this.animalShelterTranslationRepo.save(translatedTranslation);
    }

    return {
      message: `Shelter has been created successfully.`,
      data: savedShelter,
    };
  }

  async findAllAnimalShelters() {
    const animalShelters = await this.animalShelterRepo.find({
      relations: ['department', 'translations'],
    });
    return {
      message: `Successflly fetched ${animalShelters.length} animal shelters`,
      data: animalShelters,
    };
  }

  async findAnimalShelter(id: number) {
    const animalShelter = await this.animalShelterRepo.findOne({
      where: { id: id },
      relations: ['department', 'translations'],
    });

    if (!animalShelter)
      throw new NotFoundException(
        `The shelter with #ID: ${id} does not exist.`,
      );

    return {
      message: 'Shelter has been fetched successfully',
      data: animalShelter,
    };
  }

  async updateAnimalShelter(
    id: number,
    updateAnimalShelter: UpdateAnimalShelterDto,
  ) {
    const animalShelter = await this.animalShelterRepo.findOne({
      where: { id: id },
      relations: ['department', 'translations'],
    });

    if (!animalShelter)
      throw new NotFoundException(`The shelter with ID:${id} does not exist.`);

    // Update shelter fields
    Object.assign(animalShelter, updateAnimalShelter);

    // Handle Translations
    if (updateAnimalShelter.location) {
      // Define target languages
      const allLanguages = ['EN', 'TR'];
      const sourceLang = updateAnimalShelter.language || animalShelter.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        let existingTranslation = animalShelter.translations.find(
          (translation) => translation.language === targetLang,
        );

        // Translate fields if provided in the update DTO
        const translatedLocation = updateAnimalShelter.location
          ? await this.translationService.translateText(
              updateAnimalShelter.location,
              targetLang,
            )
          : existingTranslation?.location;

        if (existingTranslation) {
          Object.assign(existingTranslation, {
            location: translatedLocation,
          });
        } else {
          existingTranslation = this.animalShelterTranslationRepo.create({
            location: translatedLocation || 'Translations unavailable',
            language: targetLang,
            animalShelter: animalShelter,
          });

          animalShelter.translations.push(existingTranslation);
        }
        // Save teh transaltions
        await this.animalShelterTranslationRepo.save(existingTranslation);
      }
    }

    const updatedAnimalShelter =
      await this.animalShelterRepo.save(animalShelter);

    return {
      message: `The Animal shelter with ID: ${id} has been updated successfully.`,
    };
  }

  async deleteAnimalShelter(id: number) {
    const animalShelter = await this.animalShelterRepo.findOne({
      where: { id: id },
      relations: ['department', 'translations'],
    });

    if (!animalShelter)
      throw new NotFoundException(`The shelter with ID:${id} does not exist.`);

    // Remove associated translations
    if (animalShelter.translations?.length > 0) {
      for (const translation of animalShelter.translations) {
        await this.animalShelterTranslationRepo.remove(translation);
      }
    }

    // Remove associations with department
    animalShelter.department = null;

    await this.animalShelterRepo.save(animalShelter);

    await this.animalShelterRepo.remove(animalShelter);

    return {
      message: `The shelter with ID: ${id} has been delete successfuly.`,
    };
  }

  async createDisasterPoint(createDisasterPointDto: CreateDisasterPointDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createDisasterPointDto.departmentName,
    );
    if (!department)
      throw new NotFoundException(
        `The department with ${createDisasterPointDto.departmentName} does not exist.`,
      );

    if (
      createDisasterPointDto.departmentName.toLocaleLowerCase() != 'community'
    )
      throw new UnauthorizedException(
        'The service is not allowed to be assigned here',
      );

    const newDisasterPoint = await this.disasterPointRepo.create({
      ...createDisasterPointDto,
      department: department,
    });

    return await this.disasterPointRepo.save(newDisasterPoint);
  }

  async findAllDisasterPoints() {
    return await this.disasterPointRepo.find();
  }

  async findDisasterPoint(id: number) {
    const point = await this.disasterPointRepo.findOne({ where: { id: id } });
    if (!point)
      throw new NotFoundException(
        `The Disaster point with ID: ${id} does not exist.`,
      );
    return point;
  }

  async updateDisasterPoint(
    id: number,
    updateDisasterPointDto: UpdateDisasterPointDto,
  ) {
    const point = await this.disasterPointRepo.findOne({ where: { id: id } });
    if (!point)
      throw new NotFoundException(
        `The Disaster point with ID: ${id} does not exist.`,
      );

    return await this.disasterPointRepo.update({ id }, updateDisasterPointDto);
  }

  async removeDisasterPoint(id: number) {
    return await this.disasterPointRepo.delete(id);
  }
}
