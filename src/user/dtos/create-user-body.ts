import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateUserBody {
  @IsNotEmpty()
  @Length(5, 50)
  name: string;

  @IsNotEmpty()
  @Length(5, 90)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 30)
  password: string;
}
export class UpdateUserBody {
  @IsOptional()
  @Length(5, 50)
  name?: string;

  @IsOptional()
  @Length(5, 90)
  @IsEmail()
  email?: string;

  @IsOptional()
  @Length(8, 30)
  password?: string;
}
