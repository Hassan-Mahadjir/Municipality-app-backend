import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { Event } from './event.entity';

  
  @Entity({ name: 'EVENTTRANSLATION' })
  export class eventTranslated {
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
  language: string;

  
    // Relationship with DEPARTMENT
   @ManyToOne(()=> Event,(event) => event.translations)
   event: Event 
  }
  