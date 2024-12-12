import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Request } from './request.entity';

@Entity({ name: 'REQUEST_TRANSLATION' })
export class RequestTranslation {
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

  @ManyToOne(() => Request, (request) => request.translations)
  request: Request;
}
