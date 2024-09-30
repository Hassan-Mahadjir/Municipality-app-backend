import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({name: "COMMENT"})
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  recommendation: number; // Smallint corresponds to 'number'

  @Column()
  createAt: Date;
}
