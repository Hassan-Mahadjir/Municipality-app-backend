import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Department } from './department.entity';
import { Image } from './image.entity';
import { Comment } from './comment.entity';

@Entity({ name: 'RESTAURANT' })
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'boolean' })
  open: boolean;

  @Column()
  location: string;

  @Column()
  phone: string;

  @Column()
  openingHrWeekday: string;

  @Column()
  openingHrWeekend: string;

  @Column()
  closingHrWeekday: string;

  @Column()
  closingHrWeekend: string;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.restaurants)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  // Relationship with IMAGE
  @OneToMany(() => Image, (image) => image.retaurant)
  @JoinColumn({ name: 'restaurantId' })
  images: Image[];

  // Relationship with COMMENT
  @OneToMany(() => Comment, (comment) => comment.restaurant)
  restaurantComments: Comment[];
}
