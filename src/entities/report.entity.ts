import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { ReportTranslation } from './reportTranslation.entity';
import { Image } from './image.entity';

@Entity({ name: 'REPORT' })
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column()
  status: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  language: string;

  @CreateDateColumn()
  sendAt: Date;

  // Relationship with USER
  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.reports)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  // Relationship with IMAGE
  @OneToMany(() => Image, (image) => image.reportImage)
  @JoinColumn({ name: 'imageId' })
  images: Image[];

  // Translation Table
  @OneToMany(() => ReportTranslation, (translation) => translation.report)
  @JoinColumn({ name: 'translationId' })
  translations: ReportTranslation[];
}
