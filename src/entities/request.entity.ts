import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';

@Entity({ name: 'REQUEST' })
export class Request {
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
  @ManyToOne(() => User, (user) => user.requests)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department)
  @JoinColumn({ name: 'departmentId' })
  department: Department;
}
