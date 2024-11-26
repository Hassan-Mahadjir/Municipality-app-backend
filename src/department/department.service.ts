import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/entities/department.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UserService } from 'src/user/user.service';
import { PaginationDTO } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { departmentTranslation } from 'src/entities/departmentTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
    private userService: UserService,
    @InjectRepository(departmentTranslation)
    private translationRepo: Repository<departmentTranslation>,
    private translationService: TranslationService,
  ) {}

  async create(
    responsibleId: number,
    createDepartmentDto: CreateDepartmentDto,
  ) {
    const user = await this.userService.findOne(responsibleId);
    if (!user)
      throw new NotFoundException(`User with ID:${responsibleId} is not found`);

    if (user.role !== 'STAFF') {
      throw new UnauthorizedException(
        'User is not authorized to be resposible',
      );
    }

    // Check if the user is already responsible for a department
    const existingDepartment = await this.departmentRepo.findOne({
      where: { responsible: { id: responsibleId } },
    });

    if (existingDepartment) {
      throw new ConflictException(
        `User with ID:${responsibleId} is already responsible for the department: ${existingDepartment.name}`,
      );
    }

    // Create the new department and assign the responsible user

    const newDepartment = this.departmentRepo.create({
      ...createDepartmentDto,
      responsible: user,
    });
    await this.departmentRepo.save(newDepartment);

    // Handel Translation
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createDepartmentDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    for (const targetLang of targetLanguages) {
      const translatedName = await this.translationService.translateText(
        createDepartmentDto.name,
        targetLang,
      );
      const translateddescription = await this.translationService.translateText(
        createDepartmentDto.description,
        targetLang,
      );

      const translatedTranslation = this.translationRepo.create({
        name: translatedName || 'Translation unavailable',
        description: translateddescription || 'Translation unavailable',
        language: targetLang,
        department: newDepartment,
      });

      await this.translationRepo.save(translatedTranslation);
    }

    return {
      message: `Department has been created successfully`,
      data: { newDepartment },
    };
  }

  async findAll(paginationDTO: PaginationDTO) {
    const allServices = await this.departmentRepo.find({
      skip: paginationDTO.skip,
      take: paginationDTO.limit ?? DEFAULT_PAGE_SIZE,
      relations: ['translations'],
    });
    return { message: 'Status is 200', data: allServices };
  }

  async findDepartment(id: number) {
    const deparmtnet = await this.departmentRepo.findOne({
      where: { id: id },
      relations: ['translations'],
    });

    if (!deparmtnet)
      throw new NotFoundException(`Deparmtnet with ID:${id} does not exist.`);

    return { message: `Successfully fetched department`, data: deparmtnet };
  }

  async findDepartmentbyName(name: string) {
    const department = await this.departmentRepo
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.translations', 'translation')
      .where('department.name = :name', { name })
      .orWhere('translation.name = :name', { name })
      .getOne();

    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    // Find departmnet
    const department = await this.departmentRepo.findOne({
      where: { id: id },
      relations: ['translations'],
    });
    if (!department)
      throw new NotFoundException(`Deparmtnet with ID:${id} does not exist.`);
    // Check if responsibleId is being updated
    if (updateDepartmentDto.responsibleId) {
      const responsibleUser = await this.userService.findOne(
        updateDepartmentDto.responsibleId,
      );

      if (!responsibleUser) {
        throw new NotFoundException(
          `User with ID:${updateDepartmentDto.responsibleId} does not exist.`,
        );
      }

      if (responsibleUser.role !== 'STAFF') {
        throw new UnauthorizedException(
          'User is not authorized to be responsible.',
        );
      }

      // Ensure the new responsible user is not already responsible for another department
      const existingDepartment = await this.departmentRepo.findOne({
        where: { responsible: { id: updateDepartmentDto.responsibleId } },
      });

      if (existingDepartment && existingDepartment.id !== id) {
        throw new ConflictException(
          `User with ID:${updateDepartmentDto.responsibleId} is already responsible for the department: ${existingDepartment.name}`,
        );
      }

      // Assign the new responsible user
      department.responsible = responsibleUser;
    }

    // Update department properties
    Object.assign(department, updateDepartmentDto);

    // Update translations if name or description is provided
    if (updateDepartmentDto.description || updateDepartmentDto.name) {
      const allLanguages = ['EN', 'TR'];
      const sourceLang = department.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        const existingTranslation = department.translations.find(
          (translation) => translation.language === targetLang,
        );

        const translateddescription = updateDepartmentDto.description
          ? await this.translationService.translateText(
              updateDepartmentDto.description,
              targetLang,
            )
          : existingTranslation?.description;
        const translatedName = updateDepartmentDto.name
          ? await this.translationService.translateText(
              updateDepartmentDto.name,
              targetLang,
            )
          : existingTranslation?.name;

        if (existingTranslation) {
          Object.assign(existingTranslation, {
            name: translatedName || existingTranslation.name,
            description:
              translateddescription || existingTranslation.description,
          });
        } else {
          const newTranslation = this.translationRepo.create({
            name: translatedName || 'Translation unavailable',
            description: translateddescription || 'Translation unavailable',
            language: targetLang,
            department: department,
          });

          department.translations.push(newTranslation);
        }
      }
      // Explicitly save translations
      for (const traslation of department.translations) {
        await this.translationRepo.save(traslation);
      }
    }

    // Save the update department
    const updatdDepartment = await this.departmentRepo.save(department);
    return {
      message: `The department has been updated successfully`,
      data: updatdDepartment,
    };
  }

  async remove(id: number) {
    // Find department with its translations
    const department = await this.departmentRepo.findOne({
      where: { id },
      relations: ['translations', 'responsible'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID:${id} does not exist.`);
    }

    // Delete all translations associated with the department
    await this.translationRepo.delete({ department: { id } });

    // Remove the department itself
    await this.departmentRepo.remove(department);

    return {
      message: `Department with ID:${id} and its translations have been deleted successfully.`,
    };
  }
}
