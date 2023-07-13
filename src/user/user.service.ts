import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  async create(
    userRepository: UserRepository,
    { name, email, password },
  ): Promise<User | null> {
    return await userRepository.create(name, email, password);
  }

  async findOne(
    userRepository: UserRepository,
    email: string,
  ): Promise<User | undefined> {
    return await userRepository.findOne(email);
  }
}
