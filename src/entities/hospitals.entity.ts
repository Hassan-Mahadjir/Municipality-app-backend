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
import { HospitalTranslated } from './hospitalsTranslated.entity';

@Entity({ name: 'HOSPITAL' })
export class Hospital {
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

  @ManyToOne(() => Department, (department) => department.hospitals)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @OneToMany(
    () => HospitalTranslated,
    (hospitalTranslated) => hospitalTranslated.hospital,
  )
  @JoinColumn({ name: 'translationid' })
  translations: HospitalTranslated[];
}
