import { User } from '@prisma/client';

export abstract class UserRepository {
  abstract create(
    name: string,
    email: string,
    password: string,
  ): Promise<User | null>;

  abstract findOne(email: string): Promise<User | undefined>;

  abstract findAll(): Promise<
    { id: string; name: string; email: string }[] | undefined
  >;

  abstract update(
    id: string,
    attributes: { email?: string; name?: string; password?: string },
  ): Promise<User | null>;

  abstract delete(id: string): Promise<void>;
}
