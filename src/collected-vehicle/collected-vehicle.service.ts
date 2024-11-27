import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCollectedVehicleDto } from './dto/create-collected-vehicle.dto';
import { UpdateCollectedVehicleDto } from './dto/update-collected-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectedVehicle } from 'src/entities/collected-vehicle.entity';
import { Repository } from 'typeorm';
import { DepartmentService } from 'src/department/department.service';
import { TranslationService } from 'src/translation/translation.service';
import { CollectedVehicleTranslation } from 'src/entities/collected-vehicleTranslation.entity';

@Injectable()
export class CollectedVehicleService {
  constructor(
    @InjectRepository(CollectedVehicle)
    private collectedVehicleRepo: Repository<CollectedVehicle>,
    private departmentService: DepartmentService,
    private translationService: TranslationService,
    @InjectRepository(CollectedVehicleTranslation)
    private translationRepo: Repository<CollectedVehicleTranslation>,
  ) {}

  async create(createCollectedVehicleDto: CreateCollectedVehicleDto) {
    // Fetch the department by name (supports translations)
    const department = await this.departmentService.findDepartmentbyName(
      createCollectedVehicleDto.departmnetName,
    );

    if (!department)
      throw new NotFoundException(
        `The department with ${createCollectedVehicleDto.departmnetName} does not exists.`,
      );

    // Validate if the department name (or its translation) is "traffic"
    const isTrafficDepartment =
      department.name.toLowerCase() === 'traffic' ||
      department.translations.some(
        (translation) => translation.name.toLowerCase() === 'traffic',
      );

    if (!isTrafficDepartment) {
      throw new UnauthorizedException(
        'The service is not allowed to be assigned to this department.',
      );
    }

    // Check if a vehicle with the same plate number already exists
    const isFound = await this.findVehicleByPlateNum(
      createCollectedVehicleDto.plateNumber,
    );

    if (isFound && isFound.status === false) {
      throw new ConflictException(
        `A vehicle with plate number "${createCollectedVehicleDto.plateNumber}" already exists.`,
      );
    }

    const newCollectedVehicle = await this.collectedVehicleRepo.create({
      ...createCollectedVehicleDto,
      status: false,
      department: department,
    });
    const savedCollectedVehicle =
      await this.collectedVehicleRepo.save(newCollectedVehicle);
    // Define target languages
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createCollectedVehicleDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    // Create translations for target languages
    for (const targetLang of targetLanguages) {
      const translatedReason = createCollectedVehicleDto.reason
        ? await this.translationService.translateText(
            createCollectedVehicleDto.reason,
            targetLang,
          )
        : null;
      const translatedLocation = createCollectedVehicleDto.location
        ? await this.translationService.translateText(
            createCollectedVehicleDto.location,
            targetLang,
          )
        : null;

      const translatedTranslation = this.translationRepo.create({
        reason: translatedReason || 'Translation unavailable',
        location: translatedLocation || 'Translation unavailable',
        language: targetLang,
        collecteVehicle: savedCollectedVehicle,
      });

      await this.translationRepo.save(translatedTranslation);
    }

    return {
      message: `Collected vehicle hass been created successfully`,
      data: savedCollectedVehicle,
    };
  }

  async findAll() {
    const collectedVehicles = await this.collectedVehicleRepo.find({
      relations: ['translations'],
    });
    return {
      message: `Successfully fetched ${collectedVehicles.length} collected vehicles`,
      data: collectedVehicles,
    };
  }

  async findOne(id: number) {
    const collectedVehicle = await this.collectedVehicleRepo.findOne({
      where: { id: id },
      relations: ['translations'],
    });
    if (!collectedVehicle)
      throw new NotFoundException(
        `A vehicle with plate number ${id} already exists.`,
      );
    return {
      message: `Collected Vehicle has been fetched successuflly`,
      data: collectedVehicle,
    };
  }

  async findVehicleByPlateNum(plateNumber: string) {
    return await this.collectedVehicleRepo.findOne({
      where: { plateNumber: plateNumber },
    });
  }

  async update(
    id: number,
    updateCollectedVehicleDto: UpdateCollectedVehicleDto,
  ) {
    // Find the collected vehicle with its relations (including translations)
    const collectedVehicle = await this.collectedVehicleRepo.findOne({
      where: { id },
      relations: ['translations'],
    });

    if (!collectedVehicle) {
      throw new NotFoundException(
        `The collected vehicle with ID #${id} does not exist.`,
      );
    }

    // Update fields directly
    Object.assign(collectedVehicle, {
      ...updateCollectedVehicleDto,
    });

    // / Update translations (reason, location)
    if (
      updateCollectedVehicleDto.reason ||
      updateCollectedVehicleDto.location
    ) {
      // Define target languages
      const allLanguages = ['EN', 'TR'];
      const sourceLang = updateCollectedVehicleDto.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        const existingTranslation = collectedVehicle.translations.find(
          (translation) => translation.language === targetLang,
        );

        const translatedReason = updateCollectedVehicleDto.reason
          ? await this.translationService.translateText(
              updateCollectedVehicleDto.reason,
              targetLang,
            )
          : existingTranslation?.reason;

        const translatedLocation = updateCollectedVehicleDto.location
          ? await this.translationService.translateText(
              updateCollectedVehicleDto.location,
              targetLang,
            )
          : existingTranslation?.location;

        if (existingTranslation) {
          Object.assign(existingTranslation, {
            reason: translatedReason || 'Translation unavailable',
            location: translatedLocation || 'Translation unavailable',
          });
          await this.translationRepo.save(existingTranslation);
        } else {
          const newTranslation = this.translationRepo.create({
            reason: translatedReason || 'Translation unavailable',
            location: translatedLocation || 'Translation unavailable',
            language: targetLang,
            collecteVehicle: collectedVehicle,
          });
          await this.translationRepo.save(newTranslation);
        }
      }
    }

    // Save the updated collected vehicle
    const updatedCollectedVehicle =
      await this.collectedVehicleRepo.save(collectedVehicle);

    return {
      message: `The collected vehicle with ID #${id} has been updated successfully.`,
      data: updatedCollectedVehicle,
    };
  }

  async remove(id: number) {
    // Find the collected vehicle with its relations (including translations)
    const collectedVehicle = await this.collectedVehicleRepo.findOne({
      where: { id },
      relations: ['translations', 'department'],
    });

    // If the collected vehicle does not exist, throw an error
    if (!collectedVehicle) {
      throw new NotFoundException(
        `The collected vehicle with ID #${id} does not exist.`,
      );
    }

    // Delete translations associated with the collected vehicle
    if (
      collectedVehicle.translations &&
      collectedVehicle.translations.length > 0
    ) {
      for (const translation of collectedVehicle.translations) {
        await this.translationRepo.remove(translation);
      }
    }

    // Remove the association with the department (if necessary)
    collectedVehicle.department = null;
    await this.collectedVehicleRepo.save(collectedVehicle);

    // Remove the collected vehicle itself
    await this.collectedVehicleRepo.remove(collectedVehicle);

    return {
      message: `The collected vehicle with ID #${id} has been successfully removed.`,
    };
  }
}
