import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(@InjectRepository(Image) private imageRepo: Repository<Image>) {}

  async create(url: string) {
    const newImage = await this.imageRepo.create({
      imageUrl: url,
    });
    return await this.imageRepo.save(newImage);
  }

  async findAll() {
    return await this.imageRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  async remove(id: number) {
    return await this.imageRepo.delete(id);
  }

  async deleteImages(imageIds: number[]) {
    await this.imageRepo.delete(imageIds);
  }
}
