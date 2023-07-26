import { IsBoolean, IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateUserStockQuantityBody {
  @IsNotEmpty()
  @IsInt()
  stock_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsBoolean()
  type: boolean;
}
