import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';

@Entity('APPOINTMENTS')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  appointmentDate: string;

  @Column({ type: 'varchar', length: 50 })
  appointmentTime: string;

  @Column({ type: 'varchar', length: 255 })
  purpose: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 100 })
  appointmentWith: string;

  @ManyToOne(()=>User, (user)=>user.appointments)
  @JoinColumn({name:"userId"})
  user:User;

  @ManyToOne(()=>Department, (department)=>department.appointments)
  @JoinColumn({name:"departmentId"})
  department: Department;  
}