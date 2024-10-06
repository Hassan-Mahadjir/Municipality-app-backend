import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity({ name: 'PHARMACY' })
  export class Pharmacy {
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
    
    @Column()
    openthisWeek: boolean;
  
  }
  