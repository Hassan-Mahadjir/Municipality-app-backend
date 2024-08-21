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

  // // Relationship with PROFILE
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @BeforeInsert()
  async hashPassword() {
    // hash Password and store it in DB
    // Salt as 10 is recommended for security and performance
    this.password = await argon2.hash(this.password);
  }
}
