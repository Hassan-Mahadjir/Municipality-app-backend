import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department.entity';

@Entity({ name: 'ANIMAL SHELTER' })
export class AnimalShelter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  logo: string;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department)
  department: Department;
}
