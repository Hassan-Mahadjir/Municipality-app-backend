import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WasteType } from './waste-type.entity';
import { WasteSechduleTranslation } from './wasteSechduleTranslation.entity';

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

  @Column()
  language: string;

  //   Relationship with WASTE TYPE
  @ManyToOne(() => WasteType, (wasteType) => wasteType.sechdules)
  @JoinColumn({ name: 'wasteTypeId' })
  wasteType: WasteType;

  // Translation Table
  @OneToMany(() => WasteSechduleTranslation, (waste) => waste.wasteSechdule)
  @JoinColumn({ name: 'translationId' })
  translations: WasteSechduleTranslation[];
}
