import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DisasterPoint } from './disaster-point.entity';

@Entity({ name: 'DISASTER_POINT_TRANSLATION' })
export class DisasterPointTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @Column()
  language: string;

  @ManyToOne(() => DisasterPoint, (disasterPoint) => disasterPoint.translations)
  disasterPoint: DisasterPoint;
}
