import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Staff } from './staff.entity';

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

  @OneToOne(() => Staff, (user) => user.profile)
  @JoinColumn()
  staff: Staff;
}
