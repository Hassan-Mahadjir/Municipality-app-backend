import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { WasteSechdule } from './waste-sechdule.entity';
import { WasteTypeTranslation } from './waste-typeTranslation.entity';

@Entity({ name: 'WASTE TYPE' })
export class WasteType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  language: string;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.wasteTypes)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  //   Relationship with WASTE SECHDULE
  @OneToMany(() => WasteSechdule, (sechdule) => sechdule.wasteType)
  sechdules: WasteSechdule[];

  // Translation Table
  @OneToMany(() => WasteTypeTranslation, (translation) => translation.wasteType)
  @JoinColumn({ name: 'translationId' })
  translations: WasteTypeTranslation[];
}
