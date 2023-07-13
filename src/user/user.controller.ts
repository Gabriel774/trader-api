import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserBody } from './dtos/create-user-body';
import { UserRepository } from './repositories/user-repository';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private userRepository: UserRepository,
  ) {}

  @Post('')
  async createUser(@Body() body: CreateUserBody): Promise<User | null> {
    return await this.userService.create(this.userRepository, body);
  }
}
