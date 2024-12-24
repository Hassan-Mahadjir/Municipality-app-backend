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
import { TranslationService } from 'src/translation/translation.service';
import { HistoricalPlaceTranslation } from 'src/entities/historical-pladceTranslation.entity';
import { RestaurantTranslation } from 'src/entities/restaurantTranslations.entity';
import { CreatePaymentPointDto } from './dto/create-payment-point';
import { PaymentPoint } from 'src/entities/payment-point.entity';
import { UpdatePaymentPointDto } from './dto/update-payment-point';

@Injectable()
export class TourismService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    private imageService: ImageService,
    private departmentService: DepartmentService,
    @InjectRepository(HistoricalPlace)
    private historicalPlaceRepo: Repository<HistoricalPlace>,
    private translationService: TranslationService,
    @InjectRepository(HistoricalPlaceTranslation)
    private historicalPlaceTransaltionRepo: Repository<HistoricalPlaceTranslation>,
    @InjectRepository(RestaurantTranslation)
    private restaurantTranslationRepo: Repository<RestaurantTranslation>,
    @InjectRepository(PaymentPoint)
    private paymentPointRepo: Repository<PaymentPoint>
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
      language: createRestaruantDto.language,
      images: images, // Ensure this is an array of Image entities
    });

    // Save the new restaurant
    const savedRestaurant = await this.restaurantRepo.save(newRestaurant);

    // Define taget Languages
    // Define target languages
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createRestaruantDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    // Create translations for target languages
    for (const targetLang of targetLanguages) {
      const translatedLocation = createRestaruantDto.location
        ? await this.translationService.translateText(
            createRestaruantDto.location,
            targetLang,
          )
        : null;

      const translatedTranslation = this.restaurantTranslationRepo.create({
        location: translatedLocation,
        language: targetLang,
        restaurant: savedRestaurant,
      });

      await this.restaurantTranslationRepo.save(translatedTranslation);
    }

    return {
      messsage: 'restaurant has been created successfully.',
      data: savedRestaurant,
    };
  }

  async findAllRestaurant() {
    const restaurants = await this.restaurantRepo.find({
      relations: ['images', 'translations'],
    });

    return {
      message: `Successfully fetched ${restaurants.length} requests`,
      data: restaurants,
    };
  }

  async findOneRestaurant(id: number) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: id },
      relations: ['images', 'translations',"restaurantComments"],
    });

    if (!restaurant)
      throw new NotFoundException(
        `The Restaurant with ID:${id} does not exits.`,
      );
    return {
      message: 'Restaurant has been fetched successfully',
      data: restaurant,
    };
  }

  async updateRestaurant(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: id },
      relations: ['images', 'translations'],
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

    if (updateRestaurantDto.location) {
      // Define target languages
      const allLanguages = ['EN', 'TR'];
      const sourceLang = updateRestaurantDto.language || restaurant.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        let existingTranslation = restaurant.translations.find(
          (translation) => translation.language === targetLang,
        );

        const translatedLocation = updateRestaurantDto.location
          ? await this.translationService.translateText(
              updateRestaurantDto.location,
              targetLang,
            )
          : existingTranslation.location;
        if (existingTranslation) {
          Object.assign(existingTranslation, { locations: translatedLocation });
        } else {
          existingTranslation = this.restaurantTranslationRepo.create({
            location: translatedLocation || 'Translation unavailable',
          });
          restaurant.translations.push(existingTranslation);
        }

        await this.restaurantTranslationRepo.save(existingTranslation);
      }
    }
    // Save the updated restaurant with the new images
    const updatedRestaurant = await this.restaurantRepo.save(restaurant);

    return { message: `The restaurant with #ID: ${id} has been updated.` };
  }

  async removeRestaurant(id: number) {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id: id },
      relations: ['images', 'translations'],
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

    // Remove associated translations
    if (restaurant.translations?.length > 0) {
      for (const translation of restaurant.translations) {
        await this.restaurantTranslationRepo.remove(translation);
      }
    }

    // Remove associations with department
    restaurant.department = null;

    await this.restaurantRepo.save(restaurant);

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
    const newHistoricalPlace = this.historicalPlaceRepo.create({
      name: createHistoricalPlaceDto.name,
      location: createHistoricalPlaceDto.location,
      history: createHistoricalPlaceDto.history,
      open: createHistoricalPlaceDto.open,
      openingHrWeekday: createHistoricalPlaceDto.openingHrWeekday,
      openingHrWeekend: createHistoricalPlaceDto.openingHrWeekend,
      closingHrWeekday: createHistoricalPlaceDto.closingHrWeekday,
      closingHrWeekend: createHistoricalPlaceDto.closingHrWeekend,
      department: department,
      language: createHistoricalPlaceDto.language,
      images: images, // Ensure this is an array of Image entities
    });

    // Save the new restaurant
    const saveHistoricalPlace =
      await this.historicalPlaceRepo.save(newHistoricalPlace);

    // Step 4: Define target languages
    const allLanguages = ['EN', 'TR']; // Example: English, Turkish
    const sourceLang = createHistoricalPlaceDto.language; // Original language
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang); // Exclude original language

    for (const targetLang of targetLanguages) {
      const translatedLocation = createHistoricalPlaceDto.location
        ? await this.translationService.translateText(
            createHistoricalPlaceDto.location,
            targetLang,
          )
        : null;
      const translatedHistory = createHistoricalPlaceDto.history
        ? await this.translationService.translateText(
            createHistoricalPlaceDto.history,
            targetLang,
          )
        : null;

      const translatedTranslation = this.historicalPlaceTransaltionRepo.create({
        location: translatedLocation,
        history: translatedHistory,
        historicalPlace: saveHistoricalPlace,
        language: targetLang,
      });

      await this.historicalPlaceTransaltionRepo.save(translatedTranslation);
    }

    return {
      message: 'Historical place created successfully with translations.',
      data: saveHistoricalPlace,
    };
  }

  async findAllHistoricalPlace() {
    const historicalPlaces = await this.historicalPlaceRepo.find({
      relations: ['images', 'translations'],
    });

    return {
      message: `Successfully fetched ${historicalPlaces.length} announcements.`,
      data: historicalPlaces,
    };
  }

  async findHistoricalPlace(id: number) {
    const historicalPlace = await this.historicalPlaceRepo.findOne({
      where: { id: id },
      relations: ['images', 'translations'],
    });

    return {
      message: `Successfully fetched historical place.`,
      data: historicalPlace,
    };
  }

  async updateHistoricalPlace(
    id: number,
    updateHistoricalPlace: UpdateHistoricalPlaceDto,
  ) {
    const historicalPlace = await this.historicalPlaceRepo.findOne({
      where: { id: id },
      relations: ['images', 'translations'],
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

      // Handle translations
      if (updateHistoricalPlace.history || historicalPlace.location) {
        const allLanguages = ['EN', 'TR']; // Add other supported languages here
        const sourceLang =
          updateHistoricalPlace.language || historicalPlace.language;

        const targetLanguages = allLanguages.filter(
          (lang) => lang !== sourceLang,
        );

        for (const targetLang of targetLanguages) {
          const existingTranslation = historicalPlace.translations.find(
            (translation) => translation.language === targetLang,
          );

          const translatedHistory = updateHistoricalPlace.history
            ? await this.translationService.translateText(
                updateHistoricalPlace.history,
                targetLang,
              )
            : existingTranslation?.history;

          const translatedLocation = updateHistoricalPlace.location
            ? await this.translationService.translateText(
                updateHistoricalPlace.location,
                targetLang,
              )
            : existingTranslation?.location;

          if (existingTranslation) {
            Object.assign(existingTranslation, {
              history: translatedHistory || existingTranslation.history,
              location: translatedLocation || existingTranslation.location,
            });
          } else {
            const newTranslation = this.historicalPlaceTransaltionRepo.create({
              history: translatedHistory || 'Translation unavailable',
              location: translatedLocation || 'Translaiton unavailable',
            });
            historicalPlace.translations.push(newTranslation);
          }
        }
      }
      // Explicitly save translations
      for (const translation of historicalPlace.translations) {
        await this.historicalPlaceTransaltionRepo.save(translation);
      }
    }

    // Save the updated restaurant with the new images and transaltions
    const updatedHistoricalPlace =
      await this.historicalPlaceRepo.save(historicalPlace);

    return { message: 'Historical Place has been updated successfully.' };
  }

  async deleteHistoricalPlace(id: number) {
    const historicalPlace = await this.historicalPlaceRepo.findOne({
      where: { id: id },
      relations: ['images', 'translations'],
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

    // Remove associated translations
    if (historicalPlace.translations?.length > 0) {
      for (const translation of historicalPlace.translations) {
        await this.historicalPlaceTransaltionRepo.remove(translation);
      }
    }

    historicalPlace.department = null;

    await this.historicalPlaceRepo.save(historicalPlace);

    // Now delete the restaurant itself
    await this.historicalPlaceRepo.remove(historicalPlace);

    return {
      message: `Historical Place with ID:${id} and its images have been removed.`,
    };
  }


  async createPaymentPoint(
    createPaymentPointDto: CreatePaymentPointDto,
  ) {
    const department = await this.departmentService.findDepartmentbyName(
      createPaymentPointDto.departmentName,
    );

    if (!department)
      throw new NotFoundException(
        `The department ${createPaymentPointDto.departmentName} does not exist.`,
      );

    if (createPaymentPointDto.departmentName.toLowerCase() !== 'tourism')
      throw new UnauthorizedException(
        `The service is not allowed to assign here.`,
      );


    // Create the new payment point
    const newPaymentPoint = this.paymentPointRepo.create({
      branch: createPaymentPointDto.branch,
      phone: createPaymentPointDto.phone,
      office: createPaymentPointDto.office , 
      department:department
    });

    // Save the new point
    const savePaymentPoint =
      await this.paymentPointRepo.save(newPaymentPoint);


    return {
      message: 'Payment Point created successfully!.',
      data: savePaymentPoint,
    };
  }
  async findAllPaymentPoint() {
    const paymentPoints = await this.paymentPointRepo.find();

    return {
      message: `Successfully fetched ${paymentPoints.length} points.`,
      data: paymentPoints,
    };
  }
  async findPaymentPoint(id: number) {
    const paymentPoint = await this.paymentPointRepo.findOne({
      where: { id: id },
    });

    return {
      message: `Successfully fetched payment point.`,
      data: paymentPoint,
    };
  }


  async updatePaymentPoint(
    id: number,
    updatePaymentPoint: UpdatePaymentPointDto,
  ) {
    const paymentPoint = await this.paymentPointRepo.findOne({
      where: { id: id },
    });

    if (!paymentPoint) {
      throw new NotFoundException(
        `The Payment Point with ID:${id} does not exist.`,
      );
    }

    // Update the restaurant fields with the values from the DTO
    Object.assign(paymentPoint, updatePaymentPoint);
   

    // Save the updated restaurant with the new images and transaltions
    const updatedPaymentPoint =
      await this.paymentPointRepo.save(paymentPoint);

    return { message: 'Payment Point has been updated successfully.' };
  }


  async deletePaymentPoint(id: number) {
    const paymentPoint = await this.paymentPointRepo.findOne({
      where: { id: id },
    });

    if (!paymentPoint) {
      throw new NotFoundException(
        `The Payment Point with ID:${id} does not exist.`,
      );
    }

    paymentPoint.department = null;

    await this.paymentPointRepo.save(paymentPoint);

    // Now delete the restaurant itself
    await this.paymentPointRepo.remove(paymentPoint);

    return {
      message: `Payment Point with ID:${id} has been removed.`,
    };
  }




}
