import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';

describe('CoffeesService', () => {
  let service: CoffeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoffeesService],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

    it('should return all coffees', () => {
      const result = service.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Americano');
      expect(result[0].brand).toBe('Nescafe');
      expect(result[0].flavors).toBe(['Vanilla', 'Chocolate']);
    });
  });
});
