import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sechdule } from './sechdule.entity';

@Entity({ name: 'TIME TABLE' })
export class TimeTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  goTime: string;

  @Column()
  returnTime: string;

  //   Relationship with SECHDULE
  @ManyToOne(() => Sechdule, (sechdule) => sechdule.timeTables)
  @JoinColumn({ name: 'dayId' })
  day: Sechdule;
}
