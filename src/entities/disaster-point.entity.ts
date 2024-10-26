import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';

@Entity({ name: 'DISASTER POINT' })
export class DisasterPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @Column()
  capacity: number;

  @ManyToOne(() => Department, (department) => department.disasterPoints)
  @JoinColumn({ name: 'departmentId' })
  department: Department;
}
