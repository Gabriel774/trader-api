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
      const userExists = await this.prisma.user.findFirst({ where: { email } });
      if (userExists) return null;

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

  async findOne(email: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  async findAll(): Promise<
    { id: string; name: string; email: string }[] | undefined
  > {
    return await this.prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
  }

  async update(
    id: string,
    attributes: { email?: string; name?: string; password?: string },
  ): Promise<User | null> {
    if (attributes.password)
      attributes.password = await bcrypt.hash(attributes.password, 10);

    if (attributes.email) {
      const emailSearch = await this.prisma.user.findFirst({
        where: { email: attributes.email },
      });

      if (emailSearch?.email === attributes.email) return null;
    }

    return await this.prisma.user.update({
      data: attributes,
      where: { id },
    });
  }

  async delete(id: string): Promise<any> {
    return await this.prisma.user.delete({ where: { id } });
  }
}
