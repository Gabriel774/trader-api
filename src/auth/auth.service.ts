import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/repositories/user-repository';
import { UserService } from '../user/user.service';
import { SignInBody } from './dtos/sign-in-body';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  async signIn(
    userService: UserService,
    userRepository: UserRepository,
    jwtService: JwtService,
    { name, password }: SignInBody,
  ): Promise<{ access_token: string }> {
    const user = await userService.findOne(userRepository, name);

    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new UnauthorizedException();

    const payload = { sub: user.id, name: user.name };

    return {
      access_token: await jwtService.signAsync(payload),
    };
  }

  async getAuthenticatedUser(
    userService: UserService,
    userRepository: UserRepository,
    name: string,
  ): Promise<User | undefined> {
    const user = await userService.findOne(userRepository, name);

    delete user.password;

    return user;
  }
}
