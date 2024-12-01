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
      department: department,
    });

    return this.wasteTypeRepo.save(newType);
  }

  async modifyWasteType(id: number, updateWasteTypeDto: UpdateWasteTypeDto) {
    return this.wasteTypeRepo.update({ id: id }, updateWasteTypeDto);
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
      });

      await this.wasteSechduleRepo.save(newSechdule);
    }

    return { message: `The schedules have been created.` };
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

    for (const daySchedule of updateWasteSechduleDto.days) {
      // Check if the schedule for the day already exists
      const existingSchedule = await this.wasteSechduleRepo.findOne({
        where: { day: daySchedule.day, wasteType: { id } },
      });

      if (existingSchedule) {
        // Update the existing schedule
        existingSchedule.startTime = daySchedule.startTime;
        existingSchedule.endTime = daySchedule.endTime;
        await this.wasteSechduleRepo.save(existingSchedule);
      } else {
        // Create a new schedule entry if it doesn't exist
        const newSechdule = this.wasteSechduleRepo.create({
          day: daySchedule.day,
          startTime: daySchedule.startTime,
          endTime: daySchedule.endTime,
          wasteType: await this.wasteTypeRepo.findOne({
            where: { type: updateWasteSechduleDto.wasteType },
          }),
        });
        await this.wasteSechduleRepo.save(newSechdule);
      }
    }

    return { message: `The schedules have been updated successfully.` };
  }

  async deleteWasteType(id: number) {
    // Find the WasteType by ID
    const wasteType = await this.wasteTypeRepo.findOne({
      where: { id },
      relations: ['sechdules'], // Load associated WasteSechdule entities
    });

    if (!wasteType) {
      throw new NotFoundException(`Waste type with ID '${id}' not found.`);
    }

    // Remove associations in WasteSechdule before deleting the WasteType
    if (wasteType.sechdules.length > 0) {
      for (const sechdule of wasteType.sechdules) {
        sechdule.wasteType = null; // Remove association
        await this.wasteSechduleRepo.save(sechdule); // Update in the database
      }
    }

    // Now, delete the WasteType
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
      relations: ['department', 'user.profile', 'images'],
    });

    if (!animalReport)
      throw new NotFoundException(`The Animal with ${id} does not exist.`);

    return animalReport;
  }

  async findAllAnimalReport() {
    return await this.animalRepo.find({
      relations: ['department', 'user.profile', 'images'],
    });
  }

  async updateAnimalReport(id: number, updateAnimalDto: UpdateAnimalDto) {
    const animalReport = await this.animalRepo.findOne({
      where: { id: id },
      relations: ['department', 'user.profile', 'images'],
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

    // Save the updated animalReport entity with new images
    await this.animalRepo.save(animalReport);

    return {
      message: `The Animal report with ID: ${id} has been updated successfully, including images.`,
    };
  }

  async deleteAnimalReport(id: number) {
    const animalReport = await this.animalRepo.findOne({
      where: { id: id },
      relations: ['department', 'user.profile', 'images'], // Include images in relations
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

    // Remove the association with department and user by setting them to null
    await this.animalRepo.update(id, {
      department: null,
      user: null,
    });

    // Now delete the animal report itself
    await this.animalRepo.delete(id);

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

    return this.animalShelterRepo.save(newShelter);
  }

  async findAllAnimalShelters() {
    return await this.animalShelterRepo.find({ relations: ['department'] });
  }

  async findAnimalShelter(id: number) {
    return await this.animalShelterRepo.findOne({
      where: { id: id },
      relations: ['department'],
    });
  }

  async updateAnimalShelter(
    id: number,
    updateAnimalShelter: UpdateAnimalShelterDto,
  ) {
    const animalShelter = await this.animalShelterRepo.findOne({
      where: { id: id },
    });

    if (!animalShelter)
      throw new NotFoundException(`The shelter with ID:${id} does not exist.`);

    return this.animalShelterRepo.update({ id }, updateAnimalShelter);
  }

  async deleteAnimalShelter(id: number) {
    await this.animalShelterRepo.delete(id);

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
