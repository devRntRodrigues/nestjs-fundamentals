import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Flavor } from './flavor.entity/flavor.entity';
@Entity('coffee')
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  recommendations: number;

  @JoinTable()
  @ManyToMany((_type) => Flavor, (flavor) => flavor.coffees, { cascade: true })
  flavors: Flavor[];
}
