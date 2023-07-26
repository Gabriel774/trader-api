import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class CreateStockBody {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsInt()
  @Min(1)
  initial_value: string;
}
