import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { EmergencyContactTranslation } from './emergency-contactTranslations.entity';

@Entity({ name: 'EMERGENCY' })
export class EmergencyContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: number;

  @Column()
  language: string;

  //   Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  // Translaiton Table
  @OneToMany(
    () => EmergencyContactTranslation,
    (emergencyContact) => emergencyContact.emergencyContact,
  )
  @JoinColumn({ name: 'translationId' })
  translations: EmergencyContactTranslation[];
}
