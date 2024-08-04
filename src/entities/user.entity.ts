import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProfile } from './userProfile.entity';
import { Complaint } from './complaint.entity';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userName: string;

  @Column()
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

  // relationship with role table
  @OneToMany(() => Role, (role) => role.user)
  roles: Role[];

  @ManyToMany(() => Role, (role) => role.takenBy)
  @JoinTable({ name: 'user_Role' })
  userRoles: Role[];
}
