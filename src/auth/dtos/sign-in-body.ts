import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInBody {
  @IsNotEmpty()
  @IsString()
  @Length(3, 90)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
}
