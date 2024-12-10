import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { DepartmentService } from 'src/department/department.service';
import { HistoricalPlace } from 'src/entities/historical-place.entity';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    private departmentService: DepartmentService,
    @InjectRepository(HistoricalPlace)
    private historicalPlaceRepo: Repository<HistoricalPlace>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(id: number, createCommentDto: CreateCommentDto) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user)
      throw new NotFoundException(`The user with ID: ${id} does not exist.`);

    if (createCommentDto.commentedOn === 'historicalPlace') {
      const historicalPlace = await this.historicalPlaceRepo.findOne({
        where: { id: createCommentDto.historicalPlaceId },
      });

      if (!historicalPlace)
        throw new NotFoundException(
          `The historicalPlace with ID: ${createCommentDto.historicalPlaceId} does not exist.`,
        );

      const newComment = await this.commentRepo.create({
        body: createCommentDto.body,
        recommendation: createCommentDto.recommenation,
        user: user,
        historicalPlace: historicalPlace,
      });

      return this.commentRepo.save(newComment);
    } else if (createCommentDto.commentedOn === 'restaruant') {
      const restaruant = await this.restaurantRepo.findOne({
        where: { id: createCommentDto.restaurantId },
      });

      if (!restaruant)
        throw new NotFoundException(
          `The restaruant with ID: ${createCommentDto.restaurantId} does not exist.`,
        );

      const newComment = await this.commentRepo.create({
        body: createCommentDto.body,
        recommendation: createCommentDto.recommenation,
        user: user,
        restaurant: restaruant,
      });

      return this.commentRepo.save(newComment);
    }
  }

  async findAllComment(id: number, type: string) {
    if (type === 'restaurant') {
      const restaruant = await this.restaurantRepo.findOne({
        where: { id: id },
        relations: ['restaurantComments', 'restaurantComments.user.profile'],
      });
      return restaruant;
    } else if (type === 'historicalPlace') {
      const historicalPlace = await this.historicalPlaceRepo.findOne({
        where: { id: id },
        relations: [
          'historicalPlaceComments',
          'historicalPlaceComments.user.profile',
        ],
      });
      return {
        message: 'Comment has been fetched successfully.',
        data: historicalPlace,
      };
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID: ${id} does not exist.`);
    }

    // Update the comment fields
    comment.body = updateCommentDto.body || comment.body;
    comment.recommendation =
      updateCommentDto.recommenation || comment.recommendation;

    return this.commentRepo.save(comment);
  }

  async remove(id: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user', 'restaurant', 'historicalPlace'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID: ${id} does not exist.`);
    }

    // Clear associations
    comment.user = null;
    comment.restaurant = null;
    comment.historicalPlace = null;

    // Save the comment with cleared associations
    await this.commentRepo.save(comment);

    // Now remove the comment itself
    await this.commentRepo.remove(comment);

    return { message: `Comment with ID: ${id} has been removed successfully.` };
  }
}
