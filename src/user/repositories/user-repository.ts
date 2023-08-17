import { User } from '@prisma/client';

export abstract class UserRepository {
  abstract create(attributes: {
    name: string;
    password: string;
    profile_pic?: string | undefined;
  }): Promise<User | null>;

  abstract findOne(name: string): Promise<User | undefined>;

  abstract findOneById(id: number): Promise<User | undefined>;

  abstract findAll(): Promise<
    | { id: number; name: string; profile_pic: string; balance: number }[]
    | undefined
  >;

  abstract resetUserData(id: number): Promise<void>;

  abstract update(
    id: number,
    attributes: {
      name?: string;
      password?: string;
      profile_pic?: string;
    },
  ): Promise<User | null>;

  abstract delete(id: number, withStocks?: boolean): Promise<User>;

  abstract getRank(): Promise<
    { balance: number; name: string; profile_pic: string }[]
  >;
}
