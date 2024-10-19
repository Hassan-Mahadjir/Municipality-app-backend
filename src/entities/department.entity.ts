import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Pharmacy } from './pharmacy.entity';
import { Hospital } from './hospitals.entity';

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

  // Relationship with PHARAMCY
  @OneToMany(() => Pharmacy, (pharmacy) => pharmacy.department)
  pharmacies: Pharmacy[];

  // Relationship with HOSPITAL
  @OneToMany(() => Hospital, (hospital) => hospital.department)
  hospitals: Hospital[];
}
