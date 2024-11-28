import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Day } from './day.entity';
  
  @Entity({ name: 'DAY_TRANSLATION' })
  export class dayTranslation {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    day: string;
    
    @Column()
    language: string;

    @ManyToOne(() => Day, (day) => day.translations)
    dayTranslation: Day;
  }
  