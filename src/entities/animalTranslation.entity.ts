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
import { User } from './user.entity';
import { Image } from './image.entity';
import { Animal } from './animal.entity';

@Entity({ name: 'AMINAL_TRANSLATION' })
export class AnimalTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  status: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  language: string;

  @ManyToOne(() => Animal, (animal) => animal.translations)
  animal: Animal;
}
