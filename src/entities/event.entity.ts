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
import { eventTranslated } from './eventTransation.entity';

@Entity({ name: 'EVENT' })
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  header: string;

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
  @Column()
  language:string;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.events)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  //Relationship with IMAGE
  @OneToMany(() => Image, (image) => image.eventImage)
  @JoinColumn({ name: 'imageId' })
  images: Image[];
  
  @OneToMany(()=> eventTranslated,(eventTranslated)=>eventTranslated.event,)
  @JoinColumn({ name: 'eventTranslatedId' })
  translations: eventTranslated[];
}
