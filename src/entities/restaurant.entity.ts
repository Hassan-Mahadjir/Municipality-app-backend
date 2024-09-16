import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('increment')
  id: bigint;

  @Column({ type: 'bigint' })
  serviceId: bigint;

  @Column()
  name: string;

  @Column({ type: 'boolean' })
  weekdays: boolean;

  @Column({ type: 'boolean' })
  weekends: boolean;

  @Column()
  phone: string;  // Change to 'bigint' if necessary

  @Column()
  openWeekdays: string;

  @Column()
  closeWeekdays: string;

  @Column()
  openWeekends: string;

  @Column()
  closeWeekends: string;
}

