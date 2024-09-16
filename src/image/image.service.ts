import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  findAll(): Promise<Image[]> {
    return this.imageRepository.find();
  }

  findOne(id: string): Promise<Image> {
    return this.imageRepository.findOneBy({ id: BigInt(id) });
  }

  create(image: Image): Promise<Image> {
    return this.imageRepository.save(image);
  }

  async remove(id: string): Promise<void> {
    await this.imageRepository.delete(id);
  }
}
