import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { HistoricalPlace } from './historical-place.entity';
import { Announcement } from './annoucemnet.entity';
import { Animal } from './animal.entity';
import { Event } from './event.entity';

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

  // Relationship with ANNOUCEMENT
  @ManyToOne(() => Announcement, (annoucemnet) => annoucemnet.images)
  announcemnet: Announcement;

  // Relationship with ANIMAL
  @ManyToOne(() => Animal, (animal) => animal.images)
  animal: Animal;

  // Relationship with EVENT
  @ManyToOne(() => Event, (event) => event.images)
  eventImage: Event;
}
