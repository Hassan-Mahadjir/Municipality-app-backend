import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { AnimalShelterTranslation } from './shelterTranslations.entity';

@Entity({ name: 'ANIMAL SHELTER' })
export class AnimalShelter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({nullable:true,type:'float'})
  longitude: number
  
  @Column({nullable:true,type:'float'})
  latitude: number

  @Column()
  logo: string;

  @Column()
  language: string;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.animalShelters)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  // Traslation Table
  @OneToMany(() => AnimalShelterTranslation, (shelter) => shelter.animalShelter)
  @JoinColumn({ name: 'traslatoinId' })
  translations: AnimalShelterTranslation[];
}
