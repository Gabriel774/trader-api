import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateUserStockQuantityBody {
  @IsNotEmpty()
  @IsInt()
  stock_id: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsBoolean()
  type: boolean;
}
