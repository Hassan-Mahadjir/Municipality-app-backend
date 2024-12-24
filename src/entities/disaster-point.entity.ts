import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { DisasterPointTranslation } from './disaster-pointTranslation.entity';

@Entity({ name: 'DISASTER POINT' })
export class DisasterPoint {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;

  @Column()
  location: string;
  @Column({nullable:true,type:'float'})
  longitude: number
  @Column({nullable:true,type:'float'})
  latitude: number

  @Column()
  capacity: number;

  @Column({ nullable: true })
  language: string;

  @ManyToOne(() => Department, (department) => department.disasterPoints)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @OneToMany(
    () => DisasterPointTranslation,
    (translation) => translation.disasterPoint,
  )
  @JoinColumn({ name: 'translationId' })
  translations: DisasterPointTranslation[];
}
