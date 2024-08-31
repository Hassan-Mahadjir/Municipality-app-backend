import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { Profile } from './profile.entity';
import { Role } from '../auth/enums/role.enums';
import { Department } from './department.entity';

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

  @BeforeInsert()
  async hashPassword() {
    // hash Password and store it in DB
    // Salt as 10 is recommended for security and performance
    this.password = await argon2.hash(this.password);
  }
}
