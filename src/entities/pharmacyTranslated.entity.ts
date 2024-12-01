import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Pharmacy } from './pharmacy.entity';

@Entity({ name: 'PHARMACYTRANSLATED' })
export class pharmacyTranslated {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;



  @Column()
  language: string;

  // Relationship with DEPARTMENT


  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.translations)
  pharmacy: Pharmacy;
}
