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

@Entity({ name: 'WASTE TYPE' })
export class WasteType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  // Relationship with DEPARTMENT
  @ManyToOne(() => Department, (department) => department.wasteTypes)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  //   Relationship with WASTE SECHDULE
  @OneToMany(() => WasteSechdule, (sechdule) => sechdule.wasteType)
  sechdules: WasteSechdule[];
}
