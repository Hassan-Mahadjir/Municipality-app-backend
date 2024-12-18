import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Gendar } from 'src/auth/enums/gendar.enums';
import { ProfileTranslation } from './profileTranslation.entity';

@Entity({ name: 'PROFILE' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  dateofBirth: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  language: string;

  // user profile
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  // Trasnlation Table
  @OneToOne(() => ProfileTranslation, (translation) => translation.profile, {
    cascade: true, // Automatically cascade operations
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'translationId' })
  translation: ProfileTranslation;
}
