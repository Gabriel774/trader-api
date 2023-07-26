import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';

export abstract class UserRepository {
  abstract create(attributes: {
    name: string;
    email: string;
    password: string;
    profile_pic?: string | undefined;
  }): Promise<User | null>;

  abstract findOne(email: string): Promise<User | undefined>;

  abstract findAll(): Promise<
    { id: number; name: string; email: string }[] | undefined
  >;

  abstract update(
    id: number,
    attributes: {
      email?: string;
      name?: string;
      password?: string;
      profile_pic?: string;
    },
  ): Promise<User | null>;

  abstract delete(id: number, withStocks?: boolean): Promise<User>;

  abstract getRank(): Promise<
    { balance: number; name: string; profile_pic: string }[]
  >;

  abstract generatePasswordResetCode(
    mailService: MailerService,
    email: string,
  ): Promise<{ code: string }>;

  abstract updateUserPassword(
    email: string,
    password_reset_code: string,
    password: string,
  ): Promise<User>;
}
