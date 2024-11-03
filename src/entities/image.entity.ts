import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { HistoricalPlace } from './historical-place.entity';

@Entity({ name: 'IMAGE' })
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  // Relationship with RESTAURANT
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.images)
  retaurant: Restaurant;

  // Relationship with HISTORICAL-PLACE
  @ManyToOne(() => HistoricalPlace, (place) => place.images)
  historicalPlace: HistoricalPlace;
}
