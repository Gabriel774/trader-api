import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';
import { User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  async create(
    userRepository: UserRepository,
    attributes: {
      name: string;
      email: string;
      password: string;
      profile_pic?: string;
    },
  ): Promise<User | null> {
    return await userRepository.create(attributes);
  }

  async findAll(
    userRepository: UserRepository,
  ): Promise<{ id: number; name: string; email: string }[] | undefined> {
    return await userRepository.findAll();
  }

  async findOne(
    userRepository: UserRepository,
    email: string,
  ): Promise<User | undefined> {
    return await userRepository.findOne(email);
  }

  async update(
    userRepository: UserRepository,
    id: number,
    attributes: {
      name?: string;
      email?: string;
      password?: string;
      profile_pic?: string;
    },
  ): Promise<User | undefined> {
    return await userRepository.update(id, attributes);
  }

  async delete(userRepository: UserRepository, id: number): Promise<User> {
    return await userRepository.delete(id);
  }

  async getPasswordResetCode(
    userRepository: UserRepository,
    mailerService: MailerService,
    email: string,
  ): Promise<{ code: string }> {
    return await userRepository.generatePasswordResetCode(mailerService, email);
  }

  async updateUserPassword(
    userRepository: UserRepository,
    email: string,
    password_reset_code: string,
    password: string,
  ) {
    return await userRepository.updateUserPassword(
      email,
      password_reset_code,
      password,
    );
  }

  async getRank(
    userRepository: UserRepository,
  ): Promise<{ balance: number; name: string; profile_pic: string }[]> {
    return await userRepository.getRank();
  }
}
