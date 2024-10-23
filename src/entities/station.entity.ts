import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Line } from './line.entity';

@Entity({ name: 'STATION' })
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relationship with LINE
  @ManyToMany(() => Line, (line) => line.toStations)
  route: Line[];
}
