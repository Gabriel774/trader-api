import { PrismaService } from '../../../database/prisma.service';
import { UserRepository } from '../user-repository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { unlinkSync } from 'node:fs';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(attributes: {
    name: string;
    email: string;
    password: string;
    profile_pic?: string;
  }): Promise<User | null> {
    try {
      return await this.prisma.$transaction(async () => {
        const userExists = await this.prisma.user.findFirst({
          where: { email: attributes.email },
        });

        if (userExists) return null;

        const hash = await bcrypt.hash(attributes.password, 10);

        const res = await this.prisma.user.create({
          data: {
            name: attributes.name,
            email: attributes.email,
            password: hash,
            profile_pic: attributes.profile_pic,
          },
        });

        const stocks = await this.prisma.stock.findMany();

        stocks.map(
          async (stock) =>
            await this.prisma
              .$queryRaw`INSERT INTO UserStocks( stockId, userId, value ) VALUES ( ${stock.id}, ${res.id}, ${stock.initial_value} );`,
        );

        delete res.password;

        return res;
      });
    } catch (err) {
      if (attributes.profile_pic)
        unlinkSync(`upload/${attributes.profile_pic}`);

      return null;
    }
  }

  async findOne(email: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({
      where: { email },
      include: { UserStocks: true },
    });
  }

  async findAll(): Promise<
    { id: number; name: string; email: string }[] | undefined
  > {
    return await this.prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
  }

  async update(
    id: number,
    attributes: {
      name?: string;
      email?: string;
      password?: string;
      profile_pic?: string;
    },
  ): Promise<User | null> {
    try {
      return await this.prisma.$transaction(async () => {
        if (attributes.password)
          attributes.password = await bcrypt.hash(attributes.password, 10);

        if (attributes.email) {
          const emailSearch = await this.prisma.user.findFirst({
            where: { email: attributes.email },
          });

          if (emailSearch?.email === attributes.email) return null;
        }

        if (attributes.profile_pic) {
          const user = await this.prisma.user.findFirst({ where: { id } });

          if (user.profile_pic) unlinkSync(`upload/${user.profile_pic}`);
        }

        return await this.prisma.user.update({
          data: attributes,
          where: { id },
        });
      });
    } catch (err) {
      if (attributes.profile_pic)
        unlinkSync(`upload/${attributes.profile_pic}`);

      return err;
    }
  }

  async delete(id: number): Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }

  async getRank(): Promise<
    { balance: number; name: string; profile_pic: string }[]
  > {
    return await this.prisma.user.findMany({
      orderBy: { balance: 'desc' },
      take: 10,
      select: { balance: true, name: true, profile_pic: true },
    });
  }
}
