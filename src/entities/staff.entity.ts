import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

import * as bcrypt from 'bcrypt';

@Entity({ name: 'STAFF' })
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createAt: Date;

  // Relationship with PROFILE
  @OneToOne(() => Profile, (profile) => profile.staff)
  profile: Profile;

  @BeforeInsert()
  async hashPassword() {
    // hash Password and store it in DB
    // Salt as 10 is recommended for security and performance
    this.password = await bcrypt.hash(this.password, 10);
  }
}
