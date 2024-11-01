import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity({ name: 'IMAGE' })
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  // Relationship with RESTAURANT
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.images)
  retaurant: Restaurant;
}
