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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserBody } from './dtos/create-user-body';
import { UserRepository } from './repositories/user-repository';
import { User } from '@prisma/client';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateUserBody } from './dtos/update-user-body';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidation } from '../utils/imageValidation';
import { SupabaseService } from '../supabase/supabase.service';
import { Supabase } from '../supabase/supabase';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly supabaseService: SupabaseService,
    private userRepository: UserRepository,
    private supabase: Supabase,
  ) {}

  @Get('')
  async findAll(): Promise<{ id: number; name: string }[] | undefined> {
    return await this.userService.findAll(this.userRepository);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('profile_pic'))
  async create(
    @Body() body: CreateUserBody,
    @UploadedFile(imageValidation({ required: false }))
    profile_pic: Express.Multer.File,
  ): Promise<User | null> {
    const uploaded_image = profile_pic
      ? await this.supabaseService.uploadImage(this.supabase, profile_pic)
      : undefined;

    const res = await this.userService.create(this.userRepository, {
      ...body,
      profile_pic: uploaded_image,
    });

    if (!res) throw new BadRequestException({ msg: 'Username already exists' });

    return res;
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profile_pic'))
  @Put('')
  async update(
    @Body() body: UpdateUserBody,
    @Request() req: any,
    @UploadedFile(imageValidation({ required: false }))
    profile_pic: Express.Multer.File,
  ): Promise<User | null> {
    const uploaded_image = profile_pic
      ? await this.supabaseService.uploadImage(this.supabase, profile_pic)
      : undefined;

    const res = await this.userService.update(
      this.userRepository,
      req.user.sub,
      { ...body, profile_pic: uploaded_image },
    );

    if (!res) throw new BadRequestException({ msg: 'Username already exists' });

    return res;
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Delete('')
  async delete(@Request() req: any): Promise<object> {
    await this.userService.delete(this.userRepository, req.user.sub);
    return { msg: 'User deleted successfully' };
  }

  @Get('rank')
  async getRank(): Promise<
    { balance: number; name: string; profile_pic: string }[]
  > {
    return this.userService.getRank(this.userRepository);
  }
}
