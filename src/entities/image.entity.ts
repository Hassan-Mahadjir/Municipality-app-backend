import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: "IMAGE"})
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;
}
