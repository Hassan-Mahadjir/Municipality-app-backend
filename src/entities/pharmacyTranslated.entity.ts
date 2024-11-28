import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Pharmacy } from './pharmacy.entity';

@Entity({ name: 'PHARMACYTRANSLATED' })
export class pharmacyTranslated {
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
  @OneToMany(() => Pharmacy, (Pharmacy) => Pharmacy.translations)
  pharmacy: Pharmacy[];
}
