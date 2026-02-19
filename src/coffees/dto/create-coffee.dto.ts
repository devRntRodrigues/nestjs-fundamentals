import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @ApiProperty({
    description: 'The flavors of the coffee',
    example: ['caramel', 'chocolate'],
  })
  @IsString({ each: true })
  readonly flavors: string[];
}
