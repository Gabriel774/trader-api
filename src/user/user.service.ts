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

  async findAll(
    userRepository: UserRepository,
  ): Promise<{ id: string; name: string; email: string }[] | undefined> {
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
    id: string,
    attributes: { name?: string; email?: string; password?: string },
  ): Promise<User | undefined> {
    return await userRepository.update(id, attributes);
  }

  async delete(userRepository: UserRepository, id: string): Promise<any> {
    return await userRepository.delete(id);
  }
}
