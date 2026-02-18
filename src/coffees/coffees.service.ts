import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Americano',
      brand: 'Nescafe',
      flavors: ['Vanilla', 'Chocolate'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    const coffee = this.coffees.find((coffee) => coffee.id === parseInt(id));
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto): Coffee {
    const id =
      this.coffees.length > 0
        ? Math.max(...this.coffees.map((c) => c.id)) + 1
        : 1;
    const coffee: Coffee = {
      id,
      ...createCoffeeDto,
    };
    this.coffees.push(coffee);
    return coffee;
  }

  update(id: string, updateCoffeeDto: UpdateCoffeeDto): Coffee {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      existingCoffee.name = updateCoffeeDto.name || existingCoffee.name;
      existingCoffee.brand = updateCoffeeDto.brand || existingCoffee.brand;
      existingCoffee.flavors =
        updateCoffeeDto.flavors || existingCoffee.flavors;
    }
    return existingCoffee;
  }

  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex(
      (coffee) => coffee.id === parseInt(id),
    );
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
    return this.coffees;
  }
}
