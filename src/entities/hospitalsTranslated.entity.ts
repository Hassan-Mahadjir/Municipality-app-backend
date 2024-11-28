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
  name: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  logo: string;
  @Column()
  language: string;

  // Relationship with DEPARTMENT
  @OneToMany(() => Hospital, (Hospital) => Hospital.translations)
  hospital: Hospital[];
}
