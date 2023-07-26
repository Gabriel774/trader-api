import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserPasswordBody {
  @IsNotEmpty()
  @Length(5, 90)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(7, 7)
  password_reset_code: string;
}
