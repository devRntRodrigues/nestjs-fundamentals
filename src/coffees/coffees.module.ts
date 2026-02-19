import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';
import { Flavor, FlavorSchema } from './entities/flavor.entity/flavor.entity';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Event,
  EventSchema,
} from '../events/entities/event.entity/event.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coffee.name, schema: CoffeeSchema },
      { name: Flavor.name, schema: FlavorSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
