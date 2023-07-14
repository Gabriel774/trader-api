import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserBody, UpdateUserBody } from './dtos/create-user-body';
import { UserRepository } from './repositories/user-repository';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private userRepository: UserRepository,
  ) {}

  @Get('')
  async findAll(): Promise<
    { id: string; name: string; email: string }[] | undefined
  > {
    return await this.userService.findAll(this.userRepository);
  }

  @Post('')
  async create(@Body() body: CreateUserBody): Promise<User | null> {
    const res = await this.userService.create(this.userRepository, body);

    if (!res) throw new BadRequestException({ msg: 'Email already exists' });

    return res;
  }

  @UseGuards(AuthGuard)
  @Put('')
  async update(
    @Body() body: UpdateUserBody,
    @Request() req: any,
  ): Promise<User | null> {
    const res = await this.userService.update(
      this.userRepository,
      req.user.sub,
      body,
    );

    if (!res) throw new BadRequestException({ msg: 'Email already exists' });

    return res;
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Delete('')
  async delete(@Request() req: any): Promise<any> {
    await this.userService.delete(this.userRepository, req.user.sub);
    return { msg: 'User deleted successfully' };
  }
}
