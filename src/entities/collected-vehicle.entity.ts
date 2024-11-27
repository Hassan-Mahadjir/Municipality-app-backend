import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { CollectedVehicleTranslation } from './collected-vehicleTranslation.entity';

@Entity({ name: 'COLLECTED VEHICLE' })
export class CollectedVehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plateNumber: string;

  @Column()
  year: number;

  @Column()
  brand: string;

  @CreateDateColumn()
  collectedDate: Date;

  @Column()
  reason: string;

  @Column()
  location: string;

  @Column()
  fee: number;

  @Column()
  status: boolean;

  @Column()
  language: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Department, (department) => department.collectedVehicles)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  // Translation table
  @OneToMany(
    () => CollectedVehicleTranslation,
    (translation) => translation.collecteVehicle,
  )
  @JoinColumn({ name: 'translationId' })
  translations: CollectedVehicleTranslation[];
}
