import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WasteSechdule } from './waste-sechdule.entity';

@Entity({ name: 'WASTE_SECHDULE_TRANSLATION' })
export class WasteSechduleTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string;

  @Column()
  language: string;

  @ManyToOne(() => WasteSechdule, (sechdule) => sechdule.translations)
  wasteSechdule: WasteSechdule;
}
