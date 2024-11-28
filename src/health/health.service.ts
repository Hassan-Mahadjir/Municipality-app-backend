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
      const translatedTranslation = this.pharmacyRepo.create({
        location: translatedLocation || 'Translation unaialable',
        language: targetLang, // Store the translated language, // Link to the original announcement
      });

      await this.hospitaltranslationRepo.save(translatedTranslation);
    }
    return {
      message: 'Pharmacy created successfully with translations.',
      data: newPharmacy,
    };
  }

  findAllPharmacy() {
    return this.pharmacyRepo.find();
  }

  findOnePharmacy(id: number) {
    return this.pharmacyRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  async updatePharmcay(id: number, updatePharmacyDto: UpdatePharmacyDto) {
    return this.pharmacyRepo.update({ id }, updatePharmacyDto);
  }

  removePharmacy(id: number) {
    return this.pharmacyRepo.delete(id);
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

    return this.hospitalRepo.save(newHospital);
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
      const translatedTranslation = this.pharmacyRepo.create({
        location: translatedLocation || 'Translation unavailable',
        language: targetLang, // Store the translated language, // Link to the original announcement
      });

      await this.hospitaltranslationRepo.save(translatedTranslation);
    }
    return {
      message: 'Hospital created successfully with translations.',
      data: newHospital,
    };
    // return this.hospitalRepo.save(CreateHospitalDto);
  }

  findAllHospital() {
    return this.hospitalRepo.find();
  }

  findOneHospital(id: number) {
    return this.hospitalRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  updateHospital(id: number, UpdateHospitalDto: UpdateHospitalDto) {
    return this.hospitalRepo.update({ id }, UpdateHospitalDto);
  }

  removeHospital(id: number) {
    return this.hospitalRepo.delete(id);
  }
}
