import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pharmacy } from 'src/entities/pharmacy.entity';
import { Repository } from 'typeorm';
import { Hospital } from 'src/entities/hospitals.entity';
import { CreatePharmacyDto } from 'src/health/dto/create-pharmacy.dto';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdatePharmacyDto } from 'src/health/dto/update-pharmacy.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { DepartmentService } from 'src/department/department.service';
import { HospitalTranslated } from 'src/entities/hospitalsTranslated.entity';
import { pharmacyTranslated } from 'src/entities/pharmacyTranslated.entity';
import { TranslationService } from 'src/translation/translation.service';
@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(Pharmacy) private pharmacyRepo: Repository<Pharmacy>,
    @InjectRepository(pharmacyTranslated)
    private pharmacytranslationRepo: Repository<pharmacyTranslated>,
    @InjectRepository(Hospital) private hospitalRepo: Repository<Hospital>,
    @InjectRepository(HospitalTranslated)
    private hospitaltranslationRepo: Repository<HospitalTranslated>,
    private departmentService: DepartmentService,

    private translationService: TranslationService,
  ) {}
  async createPharmacy(createPharmacyDto: CreatePharmacyDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createPharmacyDto.departmetName,
    );
    if (!department)
      throw new NotFoundException(
        `The department with ${createPharmacyDto.departmetName} does not exists.`,
      );

    if (createPharmacyDto.departmetName.toLocaleLowerCase() != 'health')
      throw new UnauthorizedException(
        'The service is not allowed to be assigned here',
      );

    const newPharmacy = await this.pharmacyRepo.create({
      ...createPharmacyDto,
      department: department,
    });

    await this.pharmacyRepo.save(newPharmacy);

    const allLanguages = ['EN', 'TR']; // Example: English, Turkish
    const sourceLang = createPharmacyDto.language; // Original language
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang); // Exclude original language

    // Step 5: Translate content for each target language
    for (const targetLang of targetLanguages) {
      const translatedLocation = createPharmacyDto.location
        ? await this.translationService.translateText(
            createPharmacyDto.location,
            targetLang,
          )
        : null;
      const translatedTranslation = this.pharmacytranslationRepo.create({
        location: translatedLocation || 'Translation unaialable',
        language: targetLang, // Store the translated language, // Link to the original announcement
        pharmacy: newPharmacy,
      });

      await this.pharmacytranslationRepo.save(translatedTranslation);
    }
    return {
      message: 'Pharmacy created successfully with translations.',
      data: newPharmacy,
    };
  }

  async findAllPharmacy() {
    const pharmacies = await this.pharmacyRepo.find({
      relations: ['translations'],
    });
    return {
      message: `${pharmacies.length}pharmacies fetched succcessfully!`,
      data: pharmacies,
    };
  }

  async findOnePharmacy(id: number) {
    const pharmacy = await this.pharmacyRepo.findOne({
      where: {
        id: id,
      },
      relations: ['translations'],
    });
    if (!pharmacy) {
      throw new NotFoundException('Pharmacy not found');
    }
    return { message: `Fetched succcessfully!`, data: pharmacy };
  }

  async updatePharmcay(id: number, updatePharmacyDto: UpdatePharmacyDto) {
    const pharmacy = await this.pharmacyRepo.findOne({
      where: { id },
      relations: ['translations'],
    });
    if (!pharmacy) {
      throw new NotFoundException('Pharmacy not found');
    }
    Object.assign(pharmacy, updatePharmacyDto);
    if (updatePharmacyDto.location) {
      // Define target languages
      const allLanguages = ['EN', 'TR'];
      const sourceLang = updatePharmacyDto.language || pharmacy.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );
      for (const targetLang of targetLanguages) {
        let existingTranslation = pharmacy.translations.find(
          (translation) => translation.language === targetLang,
        );
        const translatedLocation = updatePharmacyDto.location
          ? await this.translationService.translateText(
              updatePharmacyDto.location,
              targetLang,
            )
          : existingTranslation?.location;
        if (existingTranslation) {
          // Update the existing translation
          Object.assign(existingTranslation, {
            location: translatedLocation,
          });
        } else {
          // Create a new translation if it doesn't exist
          existingTranslation = this.pharmacytranslationRepo.create({
            location: translatedLocation || 'Translation unavailable',
          });
          pharmacy.translations.push(existingTranslation);
        }
        await this.hospitaltranslationRepo.save(existingTranslation);
      }
      const updatedHospital = await this.pharmacyRepo.save(pharmacy);

      return { message: `The pharmacy with #ID: ${id} has been updated.` };
    }
  }

  async removePharmacy(id: number) {
    const pharmacy = await this.pharmacyRepo.findOne({
      where: { id },
      relations: ['translations'],
    });
    if (!pharmacy) {
      throw new NotFoundException('Pharmacy not found');
    }
    if (pharmacy.translations?.length > 0) {
      for (const translation of pharmacy.translations) {
        await this.pharmacytranslationRepo.delete(translation.id);
      }
    }
    pharmacy.department = null;
    await this.pharmacyRepo.save(pharmacy);

    await this.pharmacyRepo.remove(pharmacy);
    return {
      message: `The pharmacy with #ID: ${id} has been removed.`,
    };
  }

  async createHospital(createHospitalDto: CreateHospitalDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createHospitalDto.departmetName,
    );
    if (!department)
      throw new NotFoundException(
        `The department with ${createHospitalDto.departmetName} does not exists.`,
      );

    if (createHospitalDto.departmetName.toLocaleLowerCase() != 'health')
      throw new UnauthorizedException(
        'The service is not allowed to be assigned here',
      );

    const newHospital = await this.hospitalRepo.create({
      ...createHospitalDto,
      department: department,
    });
    // Save the new hospital after translations
    const savedHospital = await this.hospitalRepo.save(newHospital);

    // Handle translation logic before saving the hospital
    const allLanguages = ['EN', 'TR']; // Example: English, Turkish
    const sourceLang = createHospitalDto.language; // Original language
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang); // Exclude original language

    for (const targetLang of targetLanguages) {
      const translatedLocation = createHospitalDto.location
        ? await this.translationService.translateText(
            createHospitalDto.location,
            targetLang,
          )
        : null;
      const translatedTranslation = this.hospitaltranslationRepo.create({
        location: translatedLocation || 'Translation unavailable',
        language: targetLang, // Store the translated language,
        hospital: newHospital,
      });

      await this.hospitaltranslationRepo.save(translatedTranslation);
    }

    return {
      message: 'Hospital created successfully with translations.',
      data: savedHospital,
    };
  }

  async findAllHospital() {
    const hospitals = await this.hospitalRepo.find({
      relations: ['translations'],
    });
    return {
      message: `${hospitals.length} hospitals fetched succcessfully!`,
      data: hospitals,
    };
  }

  async findOneHospital(id: number) {
    const hospital = await this.hospitalRepo.findOne({
      where: {
        id: id,
      },
      relations: ['translations'],
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    return { message: `Fetched succcessfully!`, data: hospital };
  }

  async updateHospital(id: number, UpdateHospitalDto: UpdateHospitalDto) {
    const hospital = await this.hospitalRepo.findOne({
      where: { id },
      relations: ['translations'],
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    Object.assign(hospital, UpdateHospitalDto);
    if (UpdateHospitalDto.location) {
      // Define target languages
      const allLanguages = ['EN', 'TR'];
      const sourceLang = UpdateHospitalDto.language || hospital.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );
      for (const targetLang of targetLanguages) {
        let existingTranslation = hospital.translations.find(
          (translation) => translation.language === targetLang,
        );
        const translatedLocation = UpdateHospitalDto.location
          ? await this.translationService.translateText(
              UpdateHospitalDto.location,
              targetLang,
            )
          : existingTranslation?.location;
        if (existingTranslation) {
          // Update the existing translation
          Object.assign(existingTranslation, {
            location: translatedLocation,
          });
        } else {
          // Create a new translation if it doesn't exist
          existingTranslation = this.hospitaltranslationRepo.create({
            location: translatedLocation || 'Translation unavailable',
          });
          hospital.translations.push(existingTranslation);
        }
        await this.hospitaltranslationRepo.save(existingTranslation);
      }
      const updatedHospital = await this.hospitalRepo.save(hospital);

      return {
        message: `The hospital with #ID: ${id} has been updated.`,
        data: updatedHospital,
      };
    }
  }

  async removeHospital(id: number) {
    const hospital = await this.hospitalRepo.findOne({
      where: { id },
      relations: ['translations'],
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    if (hospital.translations?.length > 0) {
      for (const translation of hospital.translations) {
        await this.hospitaltranslationRepo.delete(translation.id);
      }
    }
    hospital.department = null;
    await this.hospitalRepo.save(hospital);

    await this.hospitalRepo.remove(hospital);
    return {
      message: `The Hospital with #ID: ${id} has been removed.`,
    };
  }
}
