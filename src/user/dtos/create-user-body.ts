import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserBody {
  @IsNotEmpty()
  @Length(5, 50)
  name: string;

  @IsNotEmpty()
  @Length(5, 90)
  email: string;

  @IsNotEmpty()
  @Length(8, 30)
  password: string;
}
