import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity({ name: 'HOSPITAL' })
  export class Hospital {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    location: string;
  
    @Column({ nullable: true })
    imageUrl: string;

    @Column()
    logo: string;
    
    
  }
  