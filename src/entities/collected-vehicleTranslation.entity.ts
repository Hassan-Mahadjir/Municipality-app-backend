import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { CollectedVehicle } from './collected-vehicle.entity';

@Entity({ name: 'COLLECTED VEHICLE_TRANSLATION' })
export class CollectedVehicleTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reason: string;

  @Column()
  location: string;

  @Column()
  language: string;

  @ManyToOne(
    () => CollectedVehicle,
    (collecteVehicle) => collecteVehicle.translations,
  )
  collecteVehicle: CollectedVehicle;
}
