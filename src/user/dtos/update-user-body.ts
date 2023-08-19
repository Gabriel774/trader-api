import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserBody {
  @IsOptional()
  @IsString()
  @Length(3, 16)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(8, 30)
  password?: string;
}
