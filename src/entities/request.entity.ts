import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'REQUEST' })
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn()
  sendAt: Date;

  @ManyToOne(() => User, (user) => user.requests)
  user: User;
}
