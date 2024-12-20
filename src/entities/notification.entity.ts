import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Report } from './report.entity';
import { Request } from './request.entity';
import { Animal } from './animal.entity';
import { Appointment } from './appointment.entity';
import { NotificationTranslation } from './notificationTranslation.entity';

@Entity({ name: 'NOTIFICATION' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @CreateDateColumn()
  sendAt: Date;

  @Column()
  language: string;

  //   relationship with USER
  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  //   relationship with REPORT
  @ManyToOne(() => Report, (report) => report.notifications)
  report: Report;

  //  relationship with REQUEST
  @ManyToOne(() => Request, (request) => request.notifications)
  request: Request;

  //   Relationship with ANIMAL
  @ManyToOne(() => Animal, (animal) => animal.notifications)
  animal: Animal;

  //   Relationship with APPOINTMENT
  @ManyToOne(() => Appointment, (appointment) => appointment.notifications)
  appointment: Appointment;

  //   Relationship with Translation
  @OneToMany(
    () => NotificationTranslation,
    (translation) => translation.notification,
  )
  translations: NotificationTranslation[];
}
