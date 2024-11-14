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

@Entity({ name: 'EVENT' })
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  category: string;

  @Column()
  startTime: string;

  @Column()
  date: string;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.events)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  //Relationship with IMAGE
  @OneToMany(() => Image, (image) => image.eventImage)
  @JoinColumn({ name: 'imageId' })
  images: Image[];
}
