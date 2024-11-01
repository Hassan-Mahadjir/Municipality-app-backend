import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { ImageService } from 'src/image/image.service';
import { Image } from 'src/entities/image.entity';
import { DepartmentService } from 'src/department/department.service';

@Injectable()
export class TourismService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    private imageService: ImageService,
    private departmentService: DepartmentService,
  ) {}

  async createRestaurant(createRestaruantDto: CreateRestaurantDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createRestaruantDto.departmentName,
    );

    if (!department)
      throw new NotFoundException(
        `The department ${createRestaruantDto.departmentName} does not exist.`,
      );

    if (createRestaruantDto.departmentName.toLowerCase() !== 'tourism')
      throw new UnauthorizedException(
        `The service is not allowed to assign here.`,
      );

    // Create Image entities for each image URL in createRestaruantDto.imageUrls array
    const images: Image[] = [];
    for (const imageUrl of createRestaruantDto.imageUrls) {
      const image = await this.imageService.create(imageUrl);
      if (image) {
        images.push(image);
      }
    }

    // Create the new restaurant
    const newRestaurant = this.restaurantRepo.create({
      name: createRestaruantDto.name,
      location: createRestaruantDto.location,
      phone: createRestaruantDto.phone,
      open: createRestaruantDto.open,
      openingHrWeekday: createRestaruantDto.openingHrWeekday,
      openingHrWeekend: createRestaruantDto.openingHrWeekend,
      closingHrWeekday: createRestaruantDto.closingHrWeekday,
      closingHrWeekend: createRestaruantDto.closingHrWeekend,
      department: department,
      images: images, // Ensure this is an array of Image entities
    });

    // Save the new restaurant
    const savedRestaurant = await this.restaurantRepo.save(newRestaurant);
    return savedRestaurant; // This should return the new restaurant with associated images
  }

  async findAllRestaurant() {
    return await this.restaurantRepo.find({
      relations: ['images'],
    });
  }

  async findOneRestaurant(id: number) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: id },
      relations: ['images'],
    });

    if (!restaurant)
      throw new NotFoundException(
        `The Restaurant with ID:${id} does not exits.`,
      );
    return restaurant;
  }

  async updateRestaurant(id: number, updateTourismDto: UpdateRestaurantDto) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: id },
      relations: ['images'],
    });

    if (!restaurant) {
      throw new NotFoundException(
        `The Restaurant with ID:${id} does not exist.`,
      );
    }

    // Update the restaurant fields with the values from the DTO
    Object.assign(restaurant, updateTourismDto);

    // Handle image updates by first removing the old images if new ones are provided
    if (updateTourismDto.imageUrls) {
      const imageIds = restaurant.images.map((image) => image.id);

      // Only delete old images if there are images to delete
      if (imageIds.length > 0) {
        await this.imageService.deleteImages(imageIds);
      }

      // Clear the restaurant's images array
      restaurant.images = [];

      // Create and add new images
      for (const imageUrl of updateTourismDto.imageUrls) {
        const image = await this.imageService.create(imageUrl);
        if (image) {
          restaurant.images.push(image);
        }
      }
    }

    // Save the updated restaurant with the new images
    return await this.restaurantRepo.save(restaurant);
  }

  async removeRestaurant(id: number) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: id },
      relations: ['images'],
    });

    if (!restaurant) {
      throw new NotFoundException(
        `The Restaurant with ID:${id} does not exist.`,
      );
    }

    // Get the image IDs to delete
    const imageIds = restaurant.images.map((image) => image.id);

    // Only delete images if there are associated images
    if (imageIds.length > 0) {
      await this.imageService.deleteImages(imageIds);
    }

    // Now delete the restaurant itself
    await this.restaurantRepo.remove(restaurant);

    return {
      message: `Restaurant with ID:${id} and its images have been removed.`,
    };
  }
}
