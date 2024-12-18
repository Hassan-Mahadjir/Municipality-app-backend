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
import { User } from './user.entity';
import { Image } from './image.entity';
import { AnimalTranslation } from './animalTranslation.entity';

@Entity({ name: 'AMINAL' })
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  status: string;

  @Column()
  description: string;

  @Column()
  contactInfo: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  location: string;

  @CreateDateColumn()
  createAt: Date;

  @Column()
  language: string;

  //   Relationship wiht DEPARTMENT
  @ManyToOne(() => Department, (department) => department.animals)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  //   Relationship with USER
  @ManyToOne(() => User, (user) => user.userAnimals)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relationship with IMAGE
  @OneToMany(() => Image, (image) => image.animal)
  @JoinColumn({ name: 'imageId' })
  images: Image[];

  // Translation Table
  @OneToMany(() => AnimalTranslation, (animalReport) => animalReport.animal)
  @JoinColumn({ name: 'translationId' })
  translations: AnimalTranslation[];
}
