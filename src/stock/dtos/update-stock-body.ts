import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
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
  @IsNumberString()
  initial_value?: string;
}
