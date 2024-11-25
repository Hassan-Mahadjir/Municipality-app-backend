import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department.entity';

@Entity({ name: 'DEPARTMENT_TRANSLATION' })
export class departmentTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  language: string;

  @ManyToOne(() => Department, (profile) => profile.translations)
  department: Department;
}
