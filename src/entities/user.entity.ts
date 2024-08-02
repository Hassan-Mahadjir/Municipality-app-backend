import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfile } from './userProfile.entity';

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

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    cascade: true,
  })
  userProfile: UserProfile;
}
