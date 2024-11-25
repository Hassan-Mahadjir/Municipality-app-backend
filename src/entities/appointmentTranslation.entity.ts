import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from './appointment.entity';

@Entity({ name: 'APPOINTMENT_TRANSLATION' })
export class AppointmentTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  purpose: string;

  @Column()
  status: string;

  @Column()
  appointmnetWith: string;

  @Column()
  language: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.translations)
  appointment: Appointment;
}
