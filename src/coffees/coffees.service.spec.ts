import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity/flavor.entity';
import { Coffee } from './entities/coffee.entity';
import { NotFoundException } from '@nestjs/common';
import coffeesConfig from './config/coffees.config';
import { Event } from 'src/events/entities/event.entity/event.entity';

type MockRepository<T extends ObjectLiteral> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
const createMockRepository = <T extends ObjectLiteral>(): MockRepository<T> =>
  ({
    findOne: jest.fn(),
    create: jest.fn(),
  }) as MockRepository<T>;

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository<Coffee>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository<Flavor>(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository<Coffee>(),
        },
        { provide: coffeesConfig.KEY, useValue: {} },
        { provide: Event, useValue: createMockRepository<Event>() },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository<Coffee>>(
      getRepositoryToken(Coffee),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = '1';
        const expectedCoffee = {};

        coffeeRepository.findOne?.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const coffeeId = '1';
        coffeeRepository.findOne?.mockReturnValue(undefined);

        try {
          await service.findOne(coffeeId);
          expect(false).toBeTruthy(); // we should never hit this line
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect((err as Error).message).toEqual(
            `Coffee #${coffeeId} not found` as string,
          );
        }
      });
    });
  });
});
