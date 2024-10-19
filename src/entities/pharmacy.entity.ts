import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';

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

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (service) => service)
  @JoinColumn({ name: 'departmentId' })
  department: Department;
}
