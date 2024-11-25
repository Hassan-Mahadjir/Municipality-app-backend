import { Gendar } from 'src/auth/enums/gendarTR.enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: 'PROFILE_TRANSLATION' })
export class ProfileTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  gender: string;

  @Column()
  language: string;

  @OneToOne(() => Profile, (profile) => profile.translation)
  profile: Profile;
}
