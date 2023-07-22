import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInBody {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Length(5, 90)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
}
