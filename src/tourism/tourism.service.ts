import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoricalPlace } from '../entities/historical-place.entity'; 
import { Restaurant } from '../entities/restaurant.entity';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { UpdateHistoricalPlaceDto } from './dto/update-historical-place.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Comment } from '../entities/comment.entity';
import { Image } from '../entities/image.entity'; 

@Injectable()
export class TourismService {
  constructor(
    @InjectRepository(HistoricalPlace)
    private historicalPlaceRepository: Repository<HistoricalPlace>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  createHistoricalPlace(historicalPlace: HistoricalPlace): Promise<HistoricalPlace> {
    return this.historicalPlaceRepository.save(historicalPlace);
  }

  findAllHistoricalPLaces(): Promise<HistoricalPlace[]> {
    return this.historicalPlaceRepository.find();
  }

  findOneHistoricalPLace(id: number): Promise<HistoricalPlace> {
    return this.historicalPlaceRepository.findOneBy({id});
  }

  async removeHistoricalPLace(id: number): Promise<void> {
    await this.historicalPlaceRepository.delete(id);
  }

  async updateHistoricalPlace(id: number, updateHistoricalPlaceDto: UpdateHistoricalPlaceDto): Promise<HistoricalPlace> {
    await this.historicalPlaceRepository.update(id, updateHistoricalPlaceDto);
    return this.historicalPlaceRepository.findOneBy({ id });
  } 

  createRestaurant(restaurant: Restaurant): Promise<Restaurant> {
    return this.restaurantRepository.save(restaurant);
  }

  findAllRestaurants(): Promise<Restaurant[]> {
    return this.restaurantRepository.find();
  }

  findOneRestaurant(id: number): Promise<Restaurant> {
    return this.restaurantRepository.findOneBy({ id });
  }

  async updateRestaurant(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
    await this.restaurantRepository.update(id, updateRestaurantDto);
    return this.restaurantRepository.findOneBy({ id });
  }  

  async deleteRestaurant(id: number): Promise<{ success: boolean }> {
    const result = await this.restaurantRepository.delete(id);
    // Return success based on the affected rows
    return { success: result.affected > 0 };
  }

  createComment(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  findAllComments(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  findOneComment(id: number): Promise<Comment> {
    return this.commentRepository.findOneBy({ id });
  }

  async removeComment(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }

  async updateComment(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    await this.commentRepository.update(id, updateCommentDto);
    return this.commentRepository.findOneBy({ id });
  } 

  createImage(image: Image): Promise<Image> {
    return this.imageRepository.save(image);
  }

  findAllImages(): Promise<Image[]> {
    return this.imageRepository.find();
  }

  findOneImage(id: number): Promise<Image> {
    return this.imageRepository.findOneBy({ id });
  }

  async removeImage(id: number): Promise<void> {
    await this.imageRepository.delete(id);
  }

  async updateImage(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    await this.imageRepository.update(id, updateImageDto);
    return this.imageRepository.findOneBy({ id });
  } 
}
