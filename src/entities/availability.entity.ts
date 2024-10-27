import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AvailabilityDay } from './availability-day.entity';
import { Department } from './department.entity';
import { Appointment } from './appointment.entity';

@Entity({ name: 'AVAILABILITY' })
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  //   Relationship with AVAILABILITY-DAY
  @ManyToOne(
    () => AvailabilityDay,
    (availability) => availability.availabilities,
  )
  @JoinColumn({ name: 'dayId' })
  day: AvailabilityDay;

  // Many-to-One: Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.availabilities)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  //   Relationship with APPOINTMENT
  @OneToOne(() => Appointment, (appointment) => appointment.availability, {
    nullable: true,
  })
  appointment: Appointment | null; // Null if not yet booked
}
