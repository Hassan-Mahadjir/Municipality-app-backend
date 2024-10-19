import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';

@Entity({ name: 'COLLECTED VEHICLE' })
export class CollectedVehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plateNumber: string;

  @Column()
  year: number;

  @Column()
  brand: string;

  @CreateDateColumn()
  collectedDate: Date;

  @Column()
  reason: string;

  @Column()
  location: string;

  @Column()
  fee: number;

  @Column()
  status: boolean;

  @ManyToOne(() => Department, (department) => department.collectedVehicles)
  @JoinColumn({ name: 'departmentId' })
  departmnet: Department;
}
