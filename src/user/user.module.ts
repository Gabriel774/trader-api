import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user-repository';
import { PrismaUserRepository } from './repositories/prisma/prisma-user-repository';
import { PrismaService } from '../database/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const uploadPath = './upload';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          cb(null, uploadPath);
        },
        filename: (req: any, file: any, cb: any) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [
    UserService,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
})
export class UserModule {}
