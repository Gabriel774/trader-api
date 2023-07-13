import { User } from '@prisma/client';

export abstract class UserRepository {
  abstract create(
    name: string,
    email: string,
    password: string,
  ): Promise<User | null>;

  abstract findOne(email: string): Promise<User>;
}
