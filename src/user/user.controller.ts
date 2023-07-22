import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  ParseFilePipeBuilder,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserBody } from './dtos/create-user-body';
import { UserRepository } from './repositories/user-repository';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserBody } from './dtos/update-user-body';
import { ResetCodeBody } from './dtos/generate-reset-code-body';
import { MailerService } from '@nestjs-modules/mailer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private userRepository: UserRepository,
    private mailerService: MailerService,
  ) {}

  @Get('')
  async findAll(): Promise<
    { id: number; name: string; email: string }[] | undefined
  > {
    return await this.userService.findAll(this.userRepository);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('profile_pic'))
  async create(
    @Body() body: CreateUserBody,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png|jpg|jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    profile_pic: Express.Multer.File,
  ): Promise<User | null> {
    const res = await this.userService.create(this.userRepository, {
      ...body,
      profile_pic: profile_pic ? profile_pic.filename : undefined,
    });

    if (!res) throw new BadRequestException({ msg: 'Email already exists' });

    return res;
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profile_pic'))
  @Put('')
  async update(
    @Body() body: UpdateUserBody,
    @Request() req: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png|jpg|jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    profile_pic: Express.Multer.File,
  ): Promise<User | null> {
    const res = await this.userService.update(
      this.userRepository,
      req.user.sub,
      { ...body, profile_pic: profile_pic ? profile_pic.filename : undefined },
    );

    if (!res) throw new BadRequestException({ msg: 'Email already exists' });

    return res;
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Delete('')
  async delete(@Request() req: any): Promise<Object> {
    await this.userService.delete(this.userRepository, req.user.sub);
    return { msg: 'User deleted successfully' };
  }

  @HttpCode(200)
  @Post('reset-code')
  async getPasswordResetCode(
    @Body() body: ResetCodeBody,
  ): Promise<{ code: string }> {
    const res = await this.userService.getPasswordResetCode(
      this.userRepository,
      this.mailerService,
      body.email,
    );

    if (!res) throw new NotFoundException({ msg: 'E-mail does not exist' });

    return res;
  }

  @Get('rank')
  async getRank(): Promise<
    { balance: number; name: string; profile_pic: string }[]
  > {
    return this.userService.getRank(this.userRepository);
  }
}
