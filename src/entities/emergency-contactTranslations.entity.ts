import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmergencyContact } from './emergency-contact.entity';

@Entity({ name: 'EMERGENCY_TRANSLSATION' })
export class EmergencyContactTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  language: string;

  @ManyToOne(
    () => EmergencyContact,
    (emergencyContact) => emergencyContact.translations,
  )
  emergencyContact: EmergencyContact;
}
