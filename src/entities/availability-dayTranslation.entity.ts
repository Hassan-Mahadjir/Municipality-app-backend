import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AvailabilityDay } from './availability-day.entity';

@Entity({ name: 'AVAILABILITY_DAY_TRANSLATIONS' })
export class AvailabilityDayTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string;

  @Column()
  language: string;

  @ManyToOne(
    () => AvailabilityDay,
    (availabilityDay) => availabilityDay.translations,
  )
  availableDay: AvailabilityDay;
}
