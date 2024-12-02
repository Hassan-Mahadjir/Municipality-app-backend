import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WasteType } from './waste-type.entity';

@Entity({ name: 'WASTE TYPE_TRANSLATION' })
export class WasteTypeTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  language: string;

  @ManyToOne(() => WasteType, (wasteType) => wasteType.translations)
  wasteType: WasteType;
}
