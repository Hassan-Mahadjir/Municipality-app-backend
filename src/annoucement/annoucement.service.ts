import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnnoucementDto } from './dto/create-annoucement.dto';
import { UpdateAnnoucementDto } from './dto/update-annoucement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Announcement } from 'src/entities/annoucemnet.entity';
import { Repository } from 'typeorm';
import { DepartmentService } from 'src/department/department.service';
import { ImageService } from 'src/image/image.service';
import { Image } from 'src/entities/image.entity';

@Injectable()
export class AnnoucementService {
  constructor(
    @InjectRepository(Announcement)
    private annoucementRepo: Repository<Announcement>,
    private departmentService: DepartmentService,
    private imageService: ImageService,
  ) {}
  async create(createAnnoucementDto: CreateAnnoucementDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createAnnoucementDto.departmentName,
    );

    if (!department)
      throw new NotFoundException(
        `The department ${createAnnoucementDto.departmentName} does not exist.`,
      );

    const images: Image[] = [];
    for (const imageUrl of createAnnoucementDto.imageUrls) {
      const image = await this.imageService.create(imageUrl);
      if (image) {
        images.push(image);
      }
    }

    const newAnnouncemnet = await this.annoucementRepo.create({
      ...createAnnoucementDto,
      department: department,
      images: images,
    });

    const savedAnnoucement = await this.annoucementRepo.save(newAnnouncemnet);

    return savedAnnoucement;
  }

  async findAll() {
    return await this.annoucementRepo.find({ relations: ['images'] });
  }

  async findOne(id: number) {
    return await this.annoucementRepo.findOne({
      where: { id: id },
      relations: ['images'],
    });
  }

  async update(id: number, updateAnnoucementDto: UpdateAnnoucementDto) {
    const annoucement = await this.annoucementRepo.findOne({
      where: { id: id },
      relations: ['images'],
    });

    if (!annoucement)
      throw new NotFoundException(
        `The Restaurant with ID:${id} does not exist.`,
      );

    Object.assign(annoucement, updateAnnoucementDto);

    if (updateAnnoucementDto.imageUrls) {
      const imageIds = annoucement.images.map((image) => image.id);

      if (imageIds.length > 0) {
        await this.imageService.deleteImages(imageIds);
      }

      annoucement.images = [];

      for (const imageUrl of updateAnnoucementDto.imageUrls) {
        const image = await this.imageService.create(imageUrl);
        if (image) {
          annoucement.images.push(image);
        }
      }
    }

    return await this.annoucementRepo.save(annoucement);
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

    await this.annoucementRepo.remove(annoucement);

    return {
      message: `Announcemnet with ID:${id} and its images have been removed.`,
    };
  }
}
