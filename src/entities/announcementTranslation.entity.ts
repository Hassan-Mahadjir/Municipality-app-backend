import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Image } from './image.entity';
import { Announcement } from './annoucemnet.entity';

@Entity({ name: 'ANNOUNCEMENT_TRANSLATION' })
export class AnnouncementTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  header: string;

  @Column()
  body: string;

  @Column({ nullable: true })
  title: string;

  @Column()
  language: string;

  @Column({ default: 'Famagusta' })
  location: string;

  @ManyToOne(() => Announcement, (announcement) => announcement.translations)
  announcement: Announcement;
}
