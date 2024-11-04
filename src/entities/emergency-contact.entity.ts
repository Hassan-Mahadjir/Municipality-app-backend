import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';

@Entity({ name: 'EMERGENCY' })
export class EmergencyContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: number;

  //   Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department)
  @JoinColumn({ name: 'departmentId' })
  department: Department;
}
