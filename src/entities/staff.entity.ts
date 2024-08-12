import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

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
}
