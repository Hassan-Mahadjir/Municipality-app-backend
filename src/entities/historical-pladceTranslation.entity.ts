import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { HistoricalPlace } from './historical-place.entity';

@Entity({ name: 'HISTORICAL_PLACE_TRANSLATION' })
export class HistoricalPlaceTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @Column()
  history: string;

  @Column()
  language: string;

  @ManyToOne(
    () => HistoricalPlace,
    (historicalPlace) => historicalPlace.translations,
  )
  historicalPlace: HistoricalPlace;
}
