import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'RESTAURANT' })
export class Restaurant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ type: 'boolean' })
  weekdays: boolean;

  @Column({ type: 'boolean' })
  weekends: boolean;

  @Column()
  phone: string;

  @Column()
  openWeekdays: string;

  @Column()
  closeWeekdays: string;

  @Column()
  openWeekends: string;

  @Column()
  closeWeekends: string;
}
