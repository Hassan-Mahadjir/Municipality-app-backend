import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentService } from 'src/department/department.service';
import { Image } from 'src/entities/image.entity';
import { Event } from 'src/entities/event.entity';
import { Repository } from 'typeorm';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class EventService {
  constructor(
    private departmentService: DepartmentService,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    private imageService: ImageService,
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
    });
    return await this.eventRepo.save(newEvent);
  }

  async findAll() {
    const events = await this.eventRepo.find({ relations: ['images'] });
    return events;
  }

  async findOne(id: number) {
    const event = await this.eventRepo.findOne({
      where: { id: id },
      relations: ['images'],
    });

    if (!event)
      throw new NotFoundException(`The event with ID:${id} does not exist.`);
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepo.findOne({
      where: { id: id },
      relations: ['images'],
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
    await this.eventRepo.save(event);

    return {
      message: `Event with ID: ${id} and its images have been updated`,
    };
  }

  async remove(id: number) {
    const event = await this.eventRepo.findOne({
      where: { id: id },
      relations: ['images'],
    });

    if (!event)
      throw new NotFoundException(`The event with ID:${id} does not exist.`);
    const imageIds = event.images.map((image) => image.id);

    if (imageIds.length > 0) {
      await this.imageService.deleteImages(imageIds);
    }

    await this.eventRepo.remove(event);

    return {
      message: `Event with ID: ${id} and its images have been removed`,
    };
  }
}
