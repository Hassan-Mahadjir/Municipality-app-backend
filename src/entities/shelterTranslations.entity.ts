import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { AnimalShelter } from './shelter.entity';

@Entity({ name: 'ANIMAL_SHELTER_TRANSLATION' })
export class AnimalShelterTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @Column()
  language: string;

  @ManyToOne(() => AnimalShelter, (shelter) => shelter.translations)
  animalShelter: AnimalShelter;
}
