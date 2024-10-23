import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeTable } from './time-table.entity';

@Entity({ name: 'SECHDULE' })
export class Sechdule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string;

  //   Relationship with TIME-TABLE
  @OneToMany(() => TimeTable, (timeTable) => timeTable.day)
  timeTables: TimeTable[];
}
