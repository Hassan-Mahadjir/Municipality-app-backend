import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Availability } from './availability.entity';
import { AvailabilityDayTranslation } from './availability-dayTranslation.entity';

@Entity({ name: 'AVAILABILITY DAY' })
export class AvailabilityDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  day: string;

  @Column()
  language: string;

  // One-to-Many: Relationship with AVAILABILITY
  @OneToMany(() => Availability, (availability) => availability.day)
  availabilities: Availability[];

  // Translation table
  @OneToMany(
    () => AvailabilityDayTranslation,
    (translation) => translation.availableDay,
  )
  @JoinColumn({ name: 'translationId' })
  translations: AvailabilityDayTranslation[];
}
