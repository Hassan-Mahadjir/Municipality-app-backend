import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimeTable } from './time-table.entity';

@Entity({ name: 'DAY' })
export class Day {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string;

  //Relationship with TIME-TABLE
  @ManyToMany(() => TimeTable, (timeTable) => timeTable.days)
  @JoinTable({ name: 'TIME_DAY' })
  timeTable: TimeTable[];
}
