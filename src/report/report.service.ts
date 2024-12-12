import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DepartmentService } from 'src/department/department.service';
import { TranslationService } from 'src/translation/translation.service';
import { ReportTranslation } from 'src/entities/reportTranslation.entity';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private reportRepo: Repository<Report>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private userService: UserService,
    private departmentService: DepartmentService,
    private imageService: ImageService,
    private translationService: TranslationService,
    @InjectRepository(ReportTranslation)
    private translationRepo: Repository<ReportTranslation>,
  ) {}

  async create(createReportDto: CreateReportDto, userId: number) {
    // Fetch the user
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(
        `The user with #ID: ${userId} does not exist.`,
      );
    }

    // Fetch the department by name (supports translations)
    const department = await this.departmentService.findDepartmentbyName(
      createReportDto.departmentName,
    );
    if (!department) {
      throw new NotFoundException(
        `The department ${createReportDto.departmentName} does not exist.`,
      );
    }

    // Process images
    const images = [];
    for (const imageUrl of createReportDto.imageUrls) {
      const image = await this.imageService.create(imageUrl);
      if (image) images.push(image);
    }

    // Translate the default status into the report's language
    const translatedStatus = await this.translationService.translateText(
      'On hold',
      createReportDto.language,
    );

    // Create the original report
    const newReport = this.reportRepo.create({
      subject: createReportDto.subject,
      message: createReportDto.message,
      latitude: createReportDto.latitude,
      longitude: createReportDto.longitude,
      images: images,
      language: createReportDto.language,
      department: department,
      status: translatedStatus || 'On hold',
      user: user,
    });
    const savedReport = await this.reportRepo.save(newReport);

    // Define target languages
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createReportDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    // Create translations for target languages
    for (const targetLang of targetLanguages) {
      const translatedSubject = createReportDto.subject
        ? await this.translationService.translateText(
            createReportDto.subject,
            targetLang,
          )
        : null;

      const translatedMessage = createReportDto.message
        ? await this.translationService.translateText(
            createReportDto.message,
            targetLang,
          )
        : null;

      const targetStatus = await this.translationService.translateText(
        'On hold',
        targetLang,
      );

      const translatedTranslation = this.translationRepo.create({
        subject: translatedSubject || 'Translation unavailable',
        message: translatedMessage || 'Translation unavailable',
        status: targetStatus || translatedStatus || 'On hold',
        language: targetLang,
        report: savedReport,
      });

      await this.translationRepo.save(translatedTranslation);
    }

    return {
      message: 'Report has been created successfully.',
      data: savedReport,
    };
  }

  async findAll() {
    const reports = await this.reportRepo.find({
      relations: ['user', 'department', 'images', 'translations'],
    });
    return {
      message: `Successfully fetched ${reports.length} reports`,
      data: reports,
    };
  }

  async findUserReports(userId: number) {
    const userReport = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['reports', 'reports.images', 'reports.translations'],
    });
    if (!userReport)
      throw new NotFoundException(`The user #ID: ${userId} does not exist.`);

    return {
      message: 'Report has been fetched successfully',
      data: userReport,
    };
  }

  async findOne(id: number) {
    const reportInfo = await this.reportRepo.findOne({
      where: { id: id },
      relations: [
        'user',
        'department',
        'user.profile',
        'images',
        'translations',
      ],
    });

    if (!reportInfo)
      throw new NotFoundException(
        `The request with #ID: ${id} does not exist.`,
      );
    return {
      message: 'Report has been fetched successfully',
      data: reportInfo,
    };
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    // Find the report along with its translations and related entities
    const report = await this.reportRepo.findOne({
      where: { id },
      relations: ['translations', 'department', 'images'],
    });

    if (!report) {
      throw new NotFoundException(`The report with #ID: ${id} does not exist.`);
    }

    // Update report fields
    Object.assign(report, updateReportDto);

    // Handle images
    if (updateReportDto.imageUrls) {
      const existingImageIds = report.images.map((image) => image.id);

      if (existingImageIds.length > 0) {
        await this.imageService.deleteImages(existingImageIds);
      }

      report.images = [];
      for (const imageUrl of updateReportDto.imageUrls) {
        const image = await this.imageService.create(imageUrl);
        if (image) {
          report.images.push(image);
        }
      }
    }

    // Handle translations
    if (
      updateReportDto.subject ||
      updateReportDto.message ||
      updateReportDto.status
    ) {
      // Define target languages
      const allLanguages = ['EN', 'TR'];
      const sourceLang = updateReportDto.language || report.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        let existingTranslation = report.translations.find(
          (translation) => translation.language === targetLang,
        );

        // Translate fields if provided in the update DTO
        const translatedSubject = updateReportDto.subject
          ? await this.translationService.translateText(
              updateReportDto.subject,
              targetLang,
            )
          : existingTranslation?.subject;
        const translatedMessage = updateReportDto.message
          ? await this.translationService.translateText(
              updateReportDto.message,
              targetLang,
            )
          : existingTranslation?.message;
        const translatedStatus = updateReportDto.status
          ? await this.translationService.translateText(
              updateReportDto.status,
              targetLang,
            )
          : existingTranslation?.status;

        if (existingTranslation) {
          // Update the existing translation
          Object.assign(existingTranslation, {
            subject: translatedSubject,
            status: translatedStatus,
            message: translatedMessage,
          });
        } else {
          // Create a new translation if it doesn't exist
          existingTranslation = this.translationRepo.create({
            subject: translatedSubject || 'Translation unavailable',
            status: translatedStatus || 'Translation unavailable',
            message: translatedMessage || 'Translation unavailable',
            language: targetLang,
            report: report,
          });
          report.translations.push(existingTranslation);
        }

        // Save the translation (whether updated or newly created)
        await this.translationRepo.save(existingTranslation);
      }
    }

    // Save the updated report
    const updatedReport = await this.reportRepo.save(report);

    return { message: `The report with #ID: ${id} has been updated.` };
  }

  async remove(id: number) {
    // Find the report by ID and include its relations
    const report = await this.reportRepo.findOne({
      where: { id },
      relations: ['user', 'department', 'images', 'translations'],
    });

    // If the report does not exist, throw an error
    if (!report) {
      throw new NotFoundException(`The report with ID #${id} does not exist.`);
    }

    // Remove associated images
    if (report.images?.length > 0) {
      const imageIds = report.images.map((image) => image.id);
      await this.imageService.deleteImages(imageIds);
    }

    // Remove associated translations
    if (report.translations?.length > 0) {
      for (const translation of report.translations) {
        await this.translationRepo.remove(translation);
      }
    }

    // Remove associations with user and department
    report.user = null;
    report.department = null;

    // Save changes to clear associations
    await this.reportRepo.save(report);

    // Finally, remove the report itself
    await this.reportRepo.remove(report);

    return {
      message: `The report with ID #${id} has been successfully removed.`,
    };
  }
}
