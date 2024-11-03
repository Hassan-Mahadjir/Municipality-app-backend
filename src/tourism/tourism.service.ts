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
import { HistoricalPlace } from 'src/entities/historical-place.entity';
import { CreateHistoricalPlaceDto } from './dto/create-historical-place';
import { UpdateHistoricalPlaceDto } from './dto/update-historical-place';

@Injectable()
export class TourismService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    private imageService: ImageService,
    private departmentService: DepartmentService,
    @InjectRepository(HistoricalPlace)
    private historicalPlaceRepo: Repository<HistoricalPlace>,
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

  async updateRestaurant(id: number, updateRestaurantDto: UpdateRestaurantDto) {
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
    Object.assign(restaurant, updateRestaurantDto);

    // Handle image updates by first removing the old images if new ones are provided
    if (updateRestaurantDto.imageUrls) {
      const imageIds = restaurant.images.map((image) => image.id);

      // Only delete old images if there are images to delete
      if (imageIds.length > 0) {
        await this.imageService.deleteImages(imageIds);
      }

      // Clear the restaurant's images array
      restaurant.images = [];

      // Create and add new images
      for (const imageUrl of updateRestaurantDto.imageUrls) {
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

  async createHistoricalPlace(
    createHistoricalPlaceDto: CreateHistoricalPlaceDto,
  ) {
    const department = await this.departmentService.findDepartmentbyName(
      createHistoricalPlaceDto.departmentName,
    );

    if (!department)
      throw new NotFoundException(
        `The department ${createHistoricalPlaceDto.departmentName} does not exist.`,
      );

    if (createHistoricalPlaceDto.departmentName.toLowerCase() !== 'tourism')
      throw new UnauthorizedException(
        `The service is not allowed to assign here.`,
      );

    // Create Image entities for each image URL in createRestaruantDto.imageUrls array
    const images: Image[] = [];
    for (const imageUrl of createHistoricalPlaceDto.imageUrls) {
      const image = await this.imageService.create(imageUrl);
      if (image) {
        images.push(image);
      }
    }

    // Create the new restaurant
    const newRestaurant = this.historicalPlaceRepo.create({
      name: createHistoricalPlaceDto.name,
      location: createHistoricalPlaceDto.location,
      history: createHistoricalPlaceDto.history,
      open: createHistoricalPlaceDto.open,
      openingHrWeekday: createHistoricalPlaceDto.openingHrWeekday,
      openingHrWeekend: createHistoricalPlaceDto.openingHrWeekend,
      closingHrWeekday: createHistoricalPlaceDto.closingHrWeekday,
      closingHrWeekend: createHistoricalPlaceDto.closingHrWeekend,
      department: department,
      images: images, // Ensure this is an array of Image entities
    });

    // Save the new restaurant
    const savedRestaurant = await this.historicalPlaceRepo.save(newRestaurant);
    return savedRestaurant;
  }

  async findAllHistoricalPlace() {
    return await this.historicalPlaceRepo.find({
      relations: ['images'],
    });
  }

  async findHistoricalPlace(id: number) {
    return await this.historicalPlaceRepo.findOne({
      where: { id: id },
      relations: ['images'],
    });
  }

  async updateHistoricalPlace(
    id: number,
    updateHistoricalPlace: UpdateHistoricalPlaceDto,
  ) {
    const historicalPlace = await this.historicalPlaceRepo.findOne({
      where: { id: id },
      relations: ['images'],
    });

    if (!historicalPlace) {
      throw new NotFoundException(
        `The Historical Place with ID:${id} does not exist.`,
      );
    }

    // Update the restaurant fields with the values from the DTO
    Object.assign(historicalPlace, updateHistoricalPlace);

    // Handle image updates by first removing the old images if new ones are provided
    if (updateHistoricalPlace.imageUrls) {
      const imageIds = historicalPlace.images.map((image) => image.id);

      // Only delete old images if there are images to delete
      if (imageIds.length > 0) {
        await this.imageService.deleteImages(imageIds);
      }

      // Clear the restaurant's images array
      historicalPlace.images = [];

      // Create and add new images
      for (const imageUrl of updateHistoricalPlace.imageUrls) {
        const image = await this.imageService.create(imageUrl);
        if (image) {
          historicalPlace.images.push(image);
        }
      }
    }

    // Save the updated restaurant with the new images
    return await this.historicalPlaceRepo.save(historicalPlace);
  }

  async deleteHistoricalPlace(id: number) {
    const historicalPlace = await this.historicalPlaceRepo.findOne({
      where: { id: id },
      relations: ['images'],
    });

    if (!historicalPlace) {
      throw new NotFoundException(
        `The Restaurant with ID:${id} does not exist.`,
      );
    }

    // Get the image IDs to delete
    const imageIds = historicalPlace.images.map((image) => image.id);

    // Only delete images if there are associated images
    if (imageIds.length > 0) {
      await this.imageService.deleteImages(imageIds);
    }

    // Now delete the restaurant itself
    await this.historicalPlaceRepo.remove(historicalPlace);

    return {
      message: `Historical Place with ID:${id} and its images have been removed.`,
    };
  }
}
