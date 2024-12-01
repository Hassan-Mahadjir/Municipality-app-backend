import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { Hospital } from './hospitals.entity';

@Entity({ name: 'HOSPITALTRANSLATED' })
export class HospitalTranslated {
  @PrimaryGeneratedColumn()
  id: number;

 

  @Column()
  location: string;

 


  @Column()
  language: string;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Hospital, (hospital) => hospital.translations)
  hospital: Hospital;
}
