import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Report } from './report.entity';

@Entity({ name: 'REPORT_TRANSLATION' })
export class ReportTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column()
  status: string;

  @Column()
  language: string;

  @ManyToOne(() => Report, (report) => report.translations)
  report: Report;
}
