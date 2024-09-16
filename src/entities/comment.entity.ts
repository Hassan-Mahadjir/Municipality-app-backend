import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column()
  body: string;

  @Column()
  recommendation: number; // Smallint corresponds to 'number'

  @Column()
  createAt: Date;

  @Column()
  userId: bigint;

  @Column()
  subServiceId: bigint;
}
