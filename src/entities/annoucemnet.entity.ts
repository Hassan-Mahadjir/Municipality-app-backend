import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Image } from './image.entity';
import { AnnouncementTranslation } from './announcementTranslation.entity';

@Entity({ name: 'ANNOUNCEMENT' })
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  header: string;

  @Column()
  body: string;

  @Column({ nullable: true })
  title: string;

  @CreateDateColumn()
  createAt: Date;

  @Column({ default: 'Famagusta' })
  location: string;

  @Column({ nullable: true })
  language: string;

  // Relationship with DEPARTMNET
  @ManyToOne(() => Department, (department) => department.annoucenments)
  department: Department;

  //  Relationship with IMAGE
  @OneToMany(() => Image, (image) => image.announcemnet)
  @JoinColumn({ name: 'imageId' })
  images: Image[];

  @OneToMany(
    () => AnnouncementTranslation,
    (translation) => translation.announcement,
  )
  @JoinColumn({ name: 'translationId' })
  translations: AnnouncementTranslation[];
}
