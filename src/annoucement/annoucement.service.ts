import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnnoucementDto } from './dto/create-annoucement.dto';
import { UpdateAnnoucementDto } from './dto/update-annoucement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from 'src/entities/annoucemnet.entity';
import { Repository } from 'typeorm';
import { DepartmentService } from 'src/department/department.service';
import { ImageService } from 'src/image/image.service';
import { Image } from 'src/entities/image.entity';
import { PaginationDTO } from 'src/department/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { AnnouncementTranslation } from 'src/entities/announcementTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';

@Injectable()
export class AnnoucementService {
  constructor(
    @InjectRepository(Announcement)
    private annoucementRepo: Repository<Announcement>,
    private departmentService: DepartmentService,
    private imageService: ImageService,
    @InjectRepository(AnnouncementTranslation)
    private translationRepo: Repository<AnnouncementTranslation>,
    private translationService: TranslationService,
  ) {}
  async create(createAnnouncementDto: CreateAnnoucementDto) {
    // Step 1: Find the department
    const department = await this.departmentService.findDepartmentbyName(
      createAnnouncementDto.departmentName,
    );
    if (!department) {
      throw new NotFoundException(
        `The department ${createAnnouncementDto.departmentName} does not exist.`,
      );
    }

    // Step 2: Process images
    const images = [];
    for (const imageUrl of createAnnouncementDto.imageUrls) {
      const image = await this.imageService.create(imageUrl);
      if (image) images.push(image);
    }

    // Step 3: Save the original announcement
    const announcement = this.annoucementRepo.create({
      title: createAnnouncementDto.title,
      header: createAnnouncementDto.header,
      body: createAnnouncementDto.body,
      location: createAnnouncementDto.location,
      department,
      images,
      language: createAnnouncementDto.language, // Store the original language
    });
    const savedAnnouncement = await this.annoucementRepo.save(announcement);

    // Step 4: Define target languages
    const allLanguages = ['EN', 'TR']; // Example: English, Turkish
    const sourceLang = createAnnouncementDto.language; // Original language
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang); // Exclude original language

    // Step 5: Translate content for each target language
    for (const targetLang of targetLanguages) {
      const translatedTitle = createAnnouncementDto.title
        ? await this.translationService.translateText(
            createAnnouncementDto.title,
            targetLang,
          )
        : null;
      const translatedHeader = await this.translationService.translateText(
        createAnnouncementDto.header,
        targetLang,
      );
      const translatedBody = await this.translationService.translateText(
        createAnnouncementDto.body,
        targetLang,
      );
      const translatedLocation = await this.translationService.translateText(
        createAnnouncementDto.location,
        targetLang,
      );

      // Step 6: Save each translation
      const translatedTranslation = this.translationRepo.create({
        title: translatedTitle || 'Translation unavailable',
        header: translatedHeader || 'Translation unavailable',
        body: translatedBody || 'Translation unavailable',
        location: translatedLocation || 'Translation unaialable',
        language: targetLang, // Store the translated language
        announcement: savedAnnouncement, // Link to the original announcement
      });

      await this.translationRepo.save(translatedTranslation);
    }

    // Step 7: Return the result
    return {
      message: 'Announcement created successfully with translations.',
      data: {
        announcement: savedAnnouncement,
      },
    };
  }

  async findAll(paginationDTO: PaginationDTO) {
    const allAnnouncement = await this.annoucementRepo.find({
      relations: ['images', 'translations'],
      skip: paginationDTO.skip,
      take: paginationDTO.limit ?? 5,
    });

    const totalFetched = allAnnouncement.length;
    const message = `Successfully fetched ${totalFetched} announcements.`;

    return { message: message, data: allAnnouncement };
  }

  async findOne(id: number) {
    const annoucement = await this.annoucementRepo.findOne({
      where: { id: id },
      relations: ['images', 'translations'],
    });
    const message = `Successfully fetched announcement.`;
    return { message: message, data: annoucement };
  }

  async update(id: number, updateAnnouncementDto: UpdateAnnoucementDto) {
    // Step 1: Find the announcement
    const announcement = await this.annoucementRepo.findOne({
      where: { id },
      relations: ['images', 'translations'],
    });

    if (!announcement) {
      throw new NotFoundException(
        `The Announcement with ID: ${id} does not exist.`,
      );
    }

    // Step 2: Update basic properties
    Object.assign(announcement, updateAnnouncementDto);

    // Step 3: Handle images
    if (updateAnnouncementDto.imageUrls) {
      const existingImageIds = announcement.images.map((image) => image.id);

      // Delete existing images
      if (existingImageIds.length > 0) {
        await this.imageService.deleteImages(existingImageIds);
      }

      // Create new images
      announcement.images = [];
      for (const imageUrl of updateAnnouncementDto.imageUrls) {
        const image = await this.imageService.create(imageUrl);
        if (image) {
          announcement.images.push(image);
        }
      }
    }

    // Step 4: Handle translations
    if (
      updateAnnouncementDto.title ||
      updateAnnouncementDto.header ||
      updateAnnouncementDto.body ||
      updateAnnouncementDto.location
    ) {
      const allLanguages = ['EN', 'TR']; // Add other supported languages here
      const sourceLang =
        updateAnnouncementDto.language || announcement.language;

      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        const existingTranslation = announcement.translations.find(
          (translation) => translation.language === targetLang,
        );

        const translatedTitle = updateAnnouncementDto.title
          ? await this.translationService.translateText(
              updateAnnouncementDto.title,
              targetLang,
            )
          : existingTranslation?.title;

        const translatedHeader = updateAnnouncementDto.header
          ? await this.translationService.translateText(
              updateAnnouncementDto.header,
              targetLang,
            )
          : existingTranslation?.header;

        const translatedBody = updateAnnouncementDto.body
          ? await this.translationService.translateText(
              updateAnnouncementDto.body,
              targetLang,
            )
          : existingTranslation?.body;

        const translatedLocation = updateAnnouncementDto.location
          ? await this.translationService.translateText(
              updateAnnouncementDto.location,
              targetLang,
            )
          : existingTranslation?.location;

        if (existingTranslation) {
          Object.assign(existingTranslation, {
            title: translatedTitle || existingTranslation.title,
            header: translatedHeader || existingTranslation.header,
            body: translatedBody || existingTranslation.body,
            location: translatedLocation || existingTranslation.location,
          });
        } else {
          const newTranslation = this.translationRepo.create({
            title: translatedTitle || 'Translation unavailable',
            header: translatedHeader || 'Translation unavailable',
            body: translatedBody || 'Translation unavailable',
            location: translatedLocation || 'Translation unavailable',
            language: targetLang,
            announcement,
          });
          announcement.translations.push(newTranslation);
        }
      }

      // Explicitly save translations
      for (const translation of announcement.translations) {
        await this.translationRepo.save(translation);
      }
    }

    // Save the updated announcement
    const updatedAnnouncement = await this.annoucementRepo.save(announcement);
    console.log('Updated Announcement:', updatedAnnouncement);
    return updatedAnnouncement;
  }

  async remove(id: number) {
    const annoucement = await this.annoucementRepo.findOne({
      where: { id: id },
      relations: ['images'],
    });

    if (!annoucement)
      throw new NotFoundException(
        `The Restaurant with ID:${id} does not exist.`,
      );

    const imageIds = annoucement.images.map((image) => image.id);
    if (imageIds.length > 0) {
      await this.imageService.deleteImages(imageIds);
    }

    // Remove associated translations
    if (annoucement.translations?.length > 0) {
      for (const translation of annoucement.translations) {
        await this.translationRepo.remove(translation);
      }
    }

    // Remove associateions with department
    annoucement.department = null;

    await this.annoucementRepo.remove(annoucement);

    return {
      message: `Announcemnet with ID:${id} and its images have been removed.`,
    };
  }
}
