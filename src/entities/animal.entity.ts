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
  location: string;

  @CreateDateColumn()
  createAt: Date;

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
}
