import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Day } from './day.entity';

@Entity({ name: 'TIME TABLE' })
export class TimeTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  goTime: string;

  @Column()
  returnTime: string;

  //Relationship with DAY
  @ManyToMany(() => Day, (day) => day.timeTable)
  days: Day[];
}
