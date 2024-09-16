import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HistoricalPlace {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column()
  name: string;

  @Column({ default: false })
  weekends: boolean;

  @Column({ default: false })
  weekdays: boolean;

  @Column()
  history: string;

  @Column()
  openWeekdays: string;

  @Column()
  closeWeekdays: string;

  @Column()
  openWeekends: string;

  @Column()
  closeWeekends: string;

  @Column()
  serviceId: bigint;
}
