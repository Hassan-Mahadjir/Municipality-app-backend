import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WasteType } from './waste-type.entity';

@Entity({ name: 'WASTE SECHDULE' })
export class WasteSechdule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  //   Relationship with WASTE TYPE
  @ManyToOne(() => WasteType, (wasteType) => wasteType.sechdules)
  @JoinColumn({ name: 'wasteTypeId' })
  wasteType: WasteType;
}
