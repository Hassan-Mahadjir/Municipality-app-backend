import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { pharmacyTranslated } from './pharmacyTranslated.entity';

@Entity({ name: 'PHARMACY' })
export class Pharmacy {
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
  openthisWeek: boolean;
  @Column()
  language: string;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (service) => service)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @OneToMany(
    () => pharmacyTranslated,
    (pharmacyTranslated) => pharmacyTranslated.pharmacy,
  )
  @JoinColumn({ name: 'translationid' })
  translations: pharmacyTranslated[];
}
