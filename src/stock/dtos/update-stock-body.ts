import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateStockBody {
  @IsNotEmpty()
  @IsNumberString()
  id: number;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;

  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsInt()
  @Min(1)
  initial_value?: string;
}
