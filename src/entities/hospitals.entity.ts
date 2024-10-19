import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';

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

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.hospitals)
  @JoinColumn({ name: 'departmentId' })
  department: Department;
}
