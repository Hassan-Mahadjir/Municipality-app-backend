import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentService } from 'src/department/department.service';
import { Image } from 'src/entities/image.entity';
import { Event } from 'src/entities/event.entity';
import { In, Repository } from 'typeorm';
import { ImageService } from 'src/image/image.service';
import { eventTranslated } from 'src/entities/eventTransation.entity';
import { TranslationService } from 'src/translation/translation.service';

export class EventService {
  constructor(
    private departmentService: DepartmentService,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    private imageService: ImageService,
    @InjectRepository(eventTranslated) private translationRepo: Repository<eventTranslated>,
    private translationService: TranslationService,
  ) {}
  async create(createEventDto: CreateEventDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createEventDto.departmentName,
    );

    if (!department)
      throw new NotFoundException(
        `The departmenet with name: ${createEventDto.departmentName} does not exist.`,
      );

    const images: Image[] = [];
    for (const imageUrl of createEventDto.imageUrls) {
      const image = await this.imageService.create(imageUrl);
      if (image) {
        images.push(image);
      }
    }

    const newEvent = this.eventRepo.create({
      title: createEventDto.title,
      description: createEventDto.description,
      startTime: createEventDto.startTime,
      date: createEventDto.date,
      images: images,
      header: createEventDto.header,
      department: department,
      location: createEventDto.location,
      category: createEventDto.category,
      language: createEventDto.language
    });
    const savedEvent= await this.eventRepo.save(newEvent);
    const allLanguages = ['EN', 'TR']; // Example: English, Turkish
    const sourceLang = createEventDto.language; // Original language
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang); // Exclude original language
    for (const targetLang of targetLanguages) {
      const translatedTitle = createEventDto.title
        ? await this.translationService.translateText(
            createEventDto.title,
            targetLang,
          )
        : null;
      const translatedHeader = await this.translationService.translateText(
        createEventDto.header,
        targetLang,
      );
      const translatedDescription = await this.translationService.translateText(
        createEventDto.description,
        targetLang,
      );
      const translatedLocation = await this.translationService.translateText(
        createEventDto.location,
        targetLang,
      );
      const translatedCategory = await this.translationService.translateText(
        createEventDto.category,
        targetLang,
      );
      const translatedlang = await this.translationService.translateText(
        createEventDto.language,
        targetLang,
      );

      // Step 6: Save each translation
      const translatedTranslation = this.translationRepo.create({
        title: translatedTitle || 'Translation unavailable',
        header: translatedHeader || 'Translation unavailable',
        description: translatedDescription || 'Translation unavailable',
        location: translatedLocation || 'Translation unaialable',
        category: translatedCategory || 'Translation unavailable',
        language: targetLang, // Store the translated language
        event: savedEvent, // Link to the original 
      });

      await this.translationRepo.save(translatedTranslation);
    }
    return {
      message: 'Event created successfully with translations.',
      data: savedEvent,
    };

  
  }

  async findAll() {
    const events = await this.eventRepo.find({ relations: ['images','translations'] });
    const totalFetched= events.length;
    const message=`Successfully fetched ${totalFetched}events`

    return {message: message, data :events}
  }

  async findOne(id: number) {
    const event = await this.eventRepo.findOne({
      where: { id: id },
      relations: ['images', 'translations'],
    });
  
    if (!event) {
      throw new NotFoundException(`The event with ID:${id} does not exist.`);
    }
  
    const message = `Successfully fetched event`;
    return { message, data: event };
  }
  

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepo.findOne({
      where: { id: id },
      relations: ['images','translations'],
    });

    if (!event)
      throw new NotFoundException(`The event with ID:${id} does not exist.`);

    Object.assign(event, updateEventDto);

    if (updateEventDto.imageUrls) {
      const imageIds = event.images.map((image) => image.id);

      if (imageIds.length > 0) {
        await this.imageService.deleteImages(imageIds);
      }

      event.images = [];

      for (const imageUrl of updateEventDto.imageUrls) {
        const image = await this.imageService.create(imageUrl);
        if (image) {
          event.images.push(image);
        }
      }
    }
    if (
      updateEventDto.title||
      updateEventDto.description ||
      updateEventDto.category||
      updateEventDto.header||
      updateEventDto.location
    ){
      const allLanguages = ['EN', 'TR']; // Add other supported languages here
      const sourceLang =updateEventDto.language|| event.language;
      const targetLanguages= allLanguages.filter(
        (lang) => lang !== sourceLang,
      );
      for (const targetLang of targetLanguages) {
        const existingTranslation = event.translations.find(
          (translation) => translation.language === targetLang,
        );

        const translatedTitle = updateEventDto.title
          ? await this.translationService.translateText(
              updateEventDto.title,
              targetLang,
            )
          : existingTranslation?.title;

        const translatedHeader = updateEventDto.header
          ? await this.translationService.translateText(
              updateEventDto.header,
              targetLang,
            )
          : existingTranslation?.header;

        const translatedDescription = updateEventDto.description
          ? await this.translationService.translateText(
              updateEventDto.description,
              targetLang,
            )
          : existingTranslation?.description;

        const translatedLocation = updateEventDto.location
          ? await this.translationService.translateText(
              updateEventDto.location,
              targetLang,
            )
          : existingTranslation?.location;

          const translatedCategory = updateEventDto.category
          ? await this.translationService.translateText(
              updateEventDto.category,
              targetLang,
            )
          : existingTranslation?.category;

        if (existingTranslation) {
          Object.assign(existingTranslation, {
            title: translatedTitle || existingTranslation.title,
            header: translatedHeader || existingTranslation.header,
            description: translatedDescription || existingTranslation.description,
            location: translatedLocation || existingTranslation.location,
            category: translatedCategory || existingTranslation.category,
          });
        } else {
          const newTranslation = this.translationRepo.create({
            title: translatedTitle || 'Translation unavailable',
            header: translatedHeader || 'Translation unavailable',
            description: translatedDescription || 'Translation unavailable',
            location: translatedLocation || 'Translation unavailable',
            category: translatedCategory || 'Translation unavailable',
            language: targetLang,
            event,
          });
          event.translations.push(newTranslation);
        }
      }
    }
    

    for (const translation of event.translations) {
      await this.translationRepo.save(translation);
    }
  

  // Save the updated announcement
  const updatedEvent = await this.eventRepo.save(event);
  console.log('Updated Event:', updatedEvent);
  return updatedEvent;

  }

  async remove(id: number) {
    const event = await this.eventRepo.findOne({
      where: { id: id },
      relations: ['images','translations'],
    });

    if (!event)
      throw new NotFoundException(`The event with ID:${id} does not exist.`);
    const imageIds = event.images.map((image) => image.id);

    if (imageIds.length > 0) {
      await this.imageService.deleteImages(imageIds);
    }
    // Remove associated translations
    if (event.translations?.length > 0) {
      for (const translation of event.translations) {
        await this.translationRepo.remove(translation);
      }
    }

    // Remove associations with user and department
   
    event.department = null;

    // Save changes to clear associations
    await this.eventRepo.save(event);

    await this.eventRepo.remove(event);

    return {
      message: `Event with ID: ${id} and its images have been removed`,
    };
  }
}
