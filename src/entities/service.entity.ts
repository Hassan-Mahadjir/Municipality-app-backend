import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';

@Entity({ name: 'SERVICE' })
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  imageUrl: string;

  //  Relationship with USER
  @ManyToOne(() => Department, (department) => department.services)
  @JoinColumn({ name: 'departmentID' })
  department: Department;
}
