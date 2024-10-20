import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Appointment } from './appointment.entity';

@Entity({ name: 'DEPARTMENT' })
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  phone: string;

  //  Relationship with USER
  @OneToOne(() => User, (user) => user.department)
  @JoinColumn({ name: 'responsible' })
  responsible: User;

  @OneToMany(() => Appointment, (appointment) => appointment.department)
  appointments:Appointment[];
}
