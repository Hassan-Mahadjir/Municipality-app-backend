import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column()
  roleName: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;

  @ManyToMany(() => User, (user) => user.userRoles)
  takenBy: User[];
}
