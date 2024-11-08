import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { Profile } from './profile.entity';
import { Role } from '../auth/enums/role.enums';
import { Department } from './department.entity';
import { Request } from './request.entity';
import { Appointment } from './appointment.entity';
import { Report } from './report.entity';
import { Animal } from './animal.entity';

@Entity({ name: 'USER' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createAt: Date;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @Column({ nullable: true })
  resetCode: string;

  @Column({ nullable: true })
  resetCodeExpiry: Date;

  // // Relationship with PROFILE
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  // Relationshipe with DEPARTMENT
  @OneToOne(() => Department, (department) => department.responsible)
  department: Department;

  // Relationship with REQUEST
  @OneToMany(() => Request, (request) => request.user)
  requests: Request[];

  @BeforeInsert()
  async hashPassword() {
    // hash Password and store it in DB
    // Salt as 10 is recommended for security and performance
    this.password = await argon2.hash(this.password);
  }

  // relationship with appointemnt
  @OneToMany(() => Appointment, (appointment) => appointment.user)
  userAppointments: Appointment[];

  // Relationship with REPORT
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  // Relationship with ANIMAL
  @OneToMany(() => Animal, (animal) => animal.user)
  userAnimals: Animal[];
}
