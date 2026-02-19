import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity/flavor.entity';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name)
    private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Flavor.name)
    private readonly flavorModel: Model<Flavor>,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeModel
      .find()
      .skip(offset)
      .limit(limit)
      .populate('flavors')
      .exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel
      .findById(id)
      .populate('flavors')
      .exec();
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavorIds = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const coffee = await this.coffeeModel.create({
      ...createCoffeeDto,
      flavors: flavorIds,
    });
    return coffee.populate('flavors');
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavorIds =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));
    const coffee = await this.coffeeModel
      .findByIdAndUpdate(
        id,
        { ...updateCoffeeDto, ...(flavorIds && { flavors: flavorIds }) },
        { new: true },
      )
      .populate('flavors')
      .exec();
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async remove(id: string) {
    await this.coffeeModel.findByIdAndDelete(id).exec();
    return;
  }

  async recommendCoffee(coffee: Coffee & { _id: Types.ObjectId }) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.coffeeModel.updateOne(
        { _id: coffee._id },
        { $inc: { recommendations: 1 } },
        { session },
      );
      await this.eventModel.create(
        [
          {
            name: 'recommend_coffee',
            type: 'coffee',
            payload: { coffeeId: String(coffee._id) },
          },
        ],
        { session },
      );
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      void session.endSession();
    }
  }

  private async preloadFlavorByName(name: string): Promise<string> {
    const existing = await this.flavorModel.findOne({ name }).exec();
    if (existing) {
      return String(existing._id);
    }
    const created = await this.flavorModel.create({ name });
    return String(created._id);
  }
}
