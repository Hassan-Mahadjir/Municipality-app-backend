import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimeTable } from './time-table.entity';
import { Line } from './line.entity';
import { dayTranslation } from './dayTranslation.entity';

@Entity({ name: 'DAY' })
export class Day {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string;

  @Column()
  language: string; 

  //Relationship with TIME-TABLE
  @ManyToMany(() => TimeTable, (timeTable) => timeTable.days)
  @JoinTable({ name: 'TIME_DAY' })
  timeTable: TimeTable[];

  // Relationship with LINE
  @ManyToMany(() => Line, (line) => line.sechdule)
  path: Line[];


  // Relationship with Translations
  @OneToMany(() => dayTranslation, (dayTranslation) => dayTranslation.dayTranslation)
  @JoinColumn({name:"translationId"})
  translations: dayTranslation[];

  
}
