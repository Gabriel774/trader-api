import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserBody {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @Length(5, 90)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
}
