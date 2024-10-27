import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Availability } from './availability.entity';

@Entity('APPOINTMENT')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  purpose: string;

  @Column({ default: 'Pending' })
  status: string;

  @Column()
  appointmentWith: string;

  // Relationship with USER
  @ManyToOne(() => User, (user) => user.userAppointments)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relationship with AVAILABILITY
  @OneToOne(() => Availability, (availability) => availability.appointment)
  @JoinColumn({ name: 'availabilityId' })
  availability: Availability;
}
