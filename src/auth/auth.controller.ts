import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRepository } from '../user/repositories/user-repository';
import { UserService } from '../user/user.service';
import { SignInBody } from './dtos/sign-in-body';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: SignInBody): Promise<{ access_token: string }> {
    return await this.authService.signIn(
      this.userService,
      this.userRepository,
      this.jwtService,
      body,
    );
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getAuthenticatedUser(@Request() req: any) {
    return await this.authService.getAuthenticatedUser(
      this.userService,
      this.userRepository,
      req.user.sub,
    );
  }
}
