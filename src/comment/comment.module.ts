import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/entities/restaurant.entity';
import { User } from 'src/entities/user.entity';
import { Department } from 'src/entities/department.entity';
import { Profile } from 'src/entities/profile.entity';
import { HistoricalPlace } from 'src/entities/historical-place.entity';
import { UserService } from 'src/user/user.service';
import { DepartmentService } from 'src/department/department.service';
import { ProfileService } from 'src/profile/profile.service';
import { Comment } from 'src/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment,
      Restaurant,
      User,
      Department,
      Profile,
      HistoricalPlace,
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, UserService, DepartmentService, ProfileService],
})
export class CommentModule {}
