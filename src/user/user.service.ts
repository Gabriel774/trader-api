import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
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
    const userExists = await userRepository.findOne(email);

    if (!userExists) return null;

    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    const hash = await bcrypt.hash(code, 10);

    await mailerService.sendMail({
      to: email,
      from: 'gabrielsantossousa774@gmail.com',
      subject: 'Código para alteração de senha - Trader',
      html: `<h3>Código: ${code}</h3>`,
    });

    return { code: hash };
  }

  async getRank(
    userRepository: UserRepository,
  ): Promise<{ balance: number; name: string; profile_pic: string }[]> {
    return await userRepository.getRank();
  }
}
