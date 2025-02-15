import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Station } from './station.entity';
import { Day } from './day.entity';

@Entity({ name: 'LINE' })
export class Line {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn()
  line: number;

  @Column()
  from: string;

  @Column()
  to: string;

  // Relationship with Department
  @ManyToOne(() => Department, (department) => department.lines)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  // Relationship with STATION
  @ManyToMany(() => Station, (station) => station.route)
  @JoinTable({ name: 'LINE_STATION' })
  toStations: Station[];

  // Relationship wiht DAY
  @ManyToMany(() => Day, (day) => day.path)
  @JoinTable({ name: 'BUS_SECHDULE' })
  sechdule: Day[];
}
