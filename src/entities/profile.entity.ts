import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Staff } from './staff.entity';
import { User } from './user.entity';

@Entity({ name: 'PROFILE' })
export class Profile {
  @PrimaryGeneratedColumn()
  profileId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  avatar: string;

  @Column()
  gender: string;

  @Column()
  dateofBirth: Date;

  @Column()
  address: string;

  // staff profile
  @OneToOne(() => Staff, (staff) => staff.profile)
  @JoinColumn()
  staff: Staff;

  // user profile
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
