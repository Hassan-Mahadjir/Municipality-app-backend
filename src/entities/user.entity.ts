import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from './userProfile.entity';
import { Complaint } from './complaint.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  //   relationship with Profile table
  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    cascade: true,
  })
  userProfile: UserProfile;

  //   relationship with complaint table
  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Complaint[];
}
