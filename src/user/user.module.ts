import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user-repository';
import { PrismaUserRepository } from './repositories/prisma/prisma-user-repository';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [],
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
