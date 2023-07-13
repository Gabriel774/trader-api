import { PrismaService } from 'src/database/prisma.service';
import { UserRepository } from '../user-repository';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<User | null> {
    try {
      const hash = await bcrypt.hash(password, 10);

      const res = await this.prisma.user.create({
        data: {
          id: randomUUID(),
          name,
          email,
          password: hash,
        },
      });

      delete res.password;

      return res;
    } catch (err) {
      return null;
    }
  }

  async findOne(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({ where: { email } });
    } catch (err) {
      return null;
    }
  }
}
