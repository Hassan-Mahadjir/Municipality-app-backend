import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity({ name: 'CATEGORY_TRANSLATION' })
export class CategoryTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  language: string;

  @ManyToOne(() => Category, (category) => category.translations)
  category: Category;
}
