import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/repositories/user-repository';
import { UserService } from 'src/user/user.service';
import { SignInBody } from './dtos/sign-in-body';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  async signIn(
    userService: UserService,
    userRepository: UserRepository,
    jwtService: JwtService,
    { email, password }: SignInBody,
  ): Promise<{ access_token: string }> {
    const user = await userService.findOne(userRepository, email);

    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new UnauthorizedException();

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await jwtService.signAsync(payload),
    };
  }

  async getAuthenticatedUser(
    userService: UserService,
    userRepository: UserRepository,
    email: string,
  ): Promise<User | undefined> {
    const user = await userService.findOne(userRepository, email);

    delete user.password;

    return user;
  }
}
