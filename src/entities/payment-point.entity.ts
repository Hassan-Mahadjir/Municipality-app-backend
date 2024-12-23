import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';

@Entity({ name: 'PAYMENT POINT' })
export class PaymentPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branch: string;

  @Column()
  office: string;

  @Column({ nullable: true, type: 'float' })
  latitude: number;

  @Column({ nullable: true, type: 'float' })
  longitude: number;

  @Column()
  phone: string;

  @ManyToOne(() => Department, (department) => department.paymantPoint)
  @JoinColumn({ name: 'departmentId' })
  department: Department;
}
