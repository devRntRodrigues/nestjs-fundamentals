import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Coffee } from '../coffee.entity';

@Entity('flavor')
export class Flavor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany((_type) => Coffee, (coffee) => coffee.flavors)
  coffees: Coffee[];
}
