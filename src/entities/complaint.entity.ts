import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn()
  complaintId: number;

  @Column()
  type: string;

  @Column()
  feedback: string;

  @ManyToOne(() => User, (user) => user.complaints)
  @JoinColumn({ name: 'ownerId' })
  user: User;
}
