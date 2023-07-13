import { IsNotEmpty, Length } from 'class-validator';

export class SignInBody {
  @IsNotEmpty()
  @Length(5, 90)
  email: string;

  @IsNotEmpty()
  @Length(8, 30)
  password: string;
}
