import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Department } from './department.entity';
import { Image } from './image.entity';

@Entity({ name: 'HISTORICAL PLACE' })
export class HistoricalPlace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  open: boolean;

  @Column()
  location: string;

  @Column()
  history: string;

  @Column()
  openingHrWeekday: string;

  @Column()
  openingHrWeekend: string;

  @Column()
  closingHrWeekday: string;

  @Column()
  closingHrWeekend: string;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.historicalPlaces)
  @JoinColumn({ name: 'departmnetId' })
  department: Department;

  // Relationship with IMAGE
  @OneToMany(() => Image, (image) => image.historicalPlace)
  @JoinColumn({ name: 'historicalPlaceId' })
  images: Image[];
}
