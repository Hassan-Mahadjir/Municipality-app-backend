import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column()
  imageUrl: string;

  @Column()
  subServiceId: bigint;
}
