import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    // Explicitly cast serviceId to bigint if it's causing issues
    const restaurant = this.restaurantRepository.create({
      ...createRestaurantDto,
      serviceId: BigInt(createRestaurantDto.serviceId),  // Cast to BigInt
    });

    return this.restaurantRepository.save(restaurant);
  }

  findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find();
  }

  findOne(id: bigint): Promise<Restaurant> {
    return this.restaurantRepository.findOneBy({ id });
  }

  async update(id: bigint, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
    // Convert `bigint` to `string` for the update method
    const idAsString = id.toString();
    
    // Use `idAsString` for the update, since `bigint` isn't supported here
    await this.restaurantRepository.update(idAsString, updateRestaurantDto);
  
    // Use `bigint` directly for findOneBy, since it's supported there
    return this.restaurantRepository.findOneBy({ id });
  }  

  async delete(id: bigint): Promise<{ success: boolean }> {
    // Convert `bigint` to `string` for the delete method
    const idAsString = id.toString();
  
    const result = await this.restaurantRepository.delete(idAsString);
    
    // Return success based on the affected rows
    return { success: result.affected > 0 };
  }
  
}
