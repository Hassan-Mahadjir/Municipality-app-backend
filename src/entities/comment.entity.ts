import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Restaurant } from './restaurant.entity';
import { HistoricalPlace } from './historical-place.entity';

@Entity({ name: 'COMMENT' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  recommendation: number;

  @CreateDateColumn()
  createAt: Date;

  // Relationship with USER
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relationship with RESTAURANT
  @ManyToOne(() => Restaurant, (restaruant) => restaruant.restaurantComments)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  // Relationship with RESTAURANT
  @ManyToOne(
    () => HistoricalPlace,
    (historicalPlace) => historicalPlace.historicalPlaceComments,
  )
  @JoinColumn({ name: 'historicalPlaceId' })
  historicalPlace: HistoricalPlace;
}
