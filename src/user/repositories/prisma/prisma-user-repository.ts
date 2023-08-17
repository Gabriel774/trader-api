import { PrismaService } from '../../../database/prisma.service';
import { UserRepository } from '../user-repository';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(attributes: {
    name: string;
    password: string;
    profile_pic?: string;
  }): Promise<User | null> {
    try {
      return await this.prisma.$transaction(async () => {
        const userExists = await this.prisma.user.findFirst({
          where: { name: attributes.name },
        });

        if (userExists) return null;

        const hash = await bcrypt.hash(attributes.password, 10);

        const res = await this.prisma.user.create({
          data: {
            name: attributes.name,
            password: hash,
            profile_pic: attributes.profile_pic,
          },
        });

        const stocks = await this.prisma.stock.findMany();

        if (stocks.length > 0) {
          const rows = [];

          stocks.map(async (stock) =>
            rows.push([stock.id, res.id, stock.initial_value]),
          );

          await this.prisma
            .$executeRaw`INSERT INTO "UserStocks"( "stockId", "userId", value ) VALUES ${Prisma.join(
            rows.map((row) => Prisma.sql`(${Prisma.join(row)})`),
          )}`;
        }

        delete res.password;

        return res;
      });
    } catch (err) {
      return err;
    }
  }

  async findOne(name: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({
      where: { name },
    });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return await this.prisma.user.findFirst({
      where: { id },
    });
  }

  async findAll(): Promise<
    | { id: number; name: string; profile_pic: string; balance: number }[]
    | undefined
  > {
    return await this.prisma.user.findMany({
      select: { id: true, name: true, profile_pic: true, balance: true },
    });
  }

  async update(
    id: number,
    attributes: {
      name?: string;
      password?: string;
      profile_pic?: string;
    },
  ): Promise<User | null> {
    try {
      return await this.prisma.$transaction(async () => {
        if (attributes.password)
          attributes.password = await bcrypt.hash(attributes.password, 10);

        if (attributes.name) {
          const nameSearch = await this.prisma.user.findFirst({
            where: { name: attributes.name },
          });

          if (nameSearch?.name === attributes.name && nameSearch?.id !== id) {
            return null;
          }
        }

        const res = await this.prisma.user.update({
          data: attributes,
          where: { id },
        });

        delete res.password;

        return res;
      });
    } catch (err) {
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
