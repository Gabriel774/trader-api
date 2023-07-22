import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetCodeBody {
  @IsNotEmpty()
  @Length(5, 90)
  @IsString()
  @IsEmail()
  email: string;
}
