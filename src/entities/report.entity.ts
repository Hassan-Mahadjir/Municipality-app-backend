import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';

@Entity({ name: 'REPORT' })
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column({ default: 'Pending' })
  status: string;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn()
  sendAt: Date;

  // Relationship with USER
  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.reports)
  @JoinColumn({ name: 'departmentId' })
  department: Department;
}
