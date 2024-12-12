import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { ReportTranslation } from './reportTranslation.entity';
import { CategoryTranslation } from './categoryTranslation.entity';

@Entity({ name: 'CATEGORY' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  language: string;

  // Translation Table
  @OneToMany(() => CategoryTranslation, (translation) => translation.category)
  @JoinColumn({ name: 'translationId' })
  translations: CategoryTranslation[];
}
