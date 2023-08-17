import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  async create(
    userRepository: UserRepository,
    attributes: {
      name: string;
      password: string;
      profile_pic?: string;
    },
  ): Promise<User | null> {
    return await userRepository.create(attributes);
  }

  async findAll(
    userRepository: UserRepository,
  ): Promise<{ id: number; name: string }[] | undefined> {
    return await userRepository.findAll();
  }

  async findOne(
    userRepository: UserRepository,
    name: string,
  ): Promise<User | undefined> {
    return await userRepository.findOne(name);
  }

  async findOneById(userRepository: UserRepository, id: number) {
    return await userRepository.findOneById(id);
  }

  async update(
    userRepository: UserRepository,
    id: number,
    attributes: {
      name?: string;
      password?: string;
      profile_pic?: string;
    },
  ): Promise<User | undefined> {
    const res = await userRepository.update(id, attributes);

    delete res.password;

    return res;
  }

  async delete(userRepository: UserRepository, id: number): Promise<User> {
    return await userRepository.delete(id);
  }

  async getRank(
    userRepository: UserRepository,
  ): Promise<{ balance: number; name: string; profile_pic: string }[]> {
    return await userRepository.getRank();
  }
}
