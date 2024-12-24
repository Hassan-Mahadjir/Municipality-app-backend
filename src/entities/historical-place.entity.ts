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
import { Comment } from './comment.entity';
import { HistoricalPlaceTranslation } from './historical-pladceTranslation.entity';

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

  @Column({nullable:true,type:'float'})
  longitude: number;

  @Column({nullable:true,type:'float'})
  latitude: number;

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

  @Column()
  language: string;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.historicalPlaces)
  @JoinColumn({ name: 'departmnetId' })
  department: Department;

  // Relationship with IMAGE
  @OneToMany(() => Image, (image) => image.historicalPlace)
  @JoinColumn({ name: 'historicalPlaceId' })
  images: Image[];

  // Relationship with COMMENT
  @OneToMany(() => Comment, (comment) => comment.historicalPlace)
  historicalPlaceComments: Comment[];

  // Translations Table
  @OneToMany(
    () => HistoricalPlaceTranslation,
    (translation) => translation.historicalPlace,
  )
  @JoinColumn({ name: 'translationId' })
  translations: HistoricalPlaceTranslation[];
}
