import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity({ name: 'RESTAURANT_TRANSLATION' })
export class RestaurantTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @Column()
  language: string;

  @ManyToOne(() => Restaurant, (translaiton) => translaiton.translations)
  restaurant: Restaurant;
}
