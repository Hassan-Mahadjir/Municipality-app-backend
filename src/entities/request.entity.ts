import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { Image } from './image.entity';
import { RequestTranslation } from './requestTranslation.entity';

@Entity({ name: 'REQUEST' })
export class Request {
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
  @ManyToOne(() => User, (user) => user.requests)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  // Relationship with IMAGE
  @OneToMany(() => Image, (image) => image.requestImage)
  @JoinColumn({ name: 'imageId' })
  images: Image[];

  // Translation Table
  @OneToMany(() => RequestTranslation, (translation) => translation.request)
  @JoinColumn({ name: 'translationId' })
  translations: RequestTranslation[];
}
