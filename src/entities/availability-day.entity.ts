import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Availability } from './availability.entity';

@Entity({ name: 'AVAILABILITY DAY' })
export class AvailabilityDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  day: string;

  // One-to-Many: Relationship with AVAILABILITY
  @OneToMany(() => Availability, (availability) => availability.day)
  availabilities: Availability[];
}
