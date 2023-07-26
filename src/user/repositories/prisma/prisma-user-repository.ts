import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../../../database/prisma.service';
import { UserRepository } from '../user-repository';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { unlinkSync } from 'node:fs';
import { mailerActive } from '../../../constants';

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

  async findOne(email: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({
      where: { email },
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

  async generatePasswordResetCode(
    mailerService: MailerService,
    email: string,
  ): Promise<{ code: string }> {
    const user = await this.findOne(email);

    if (!user) return null;

    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    const hash = await bcrypt.hash(code, 10);

    if (mailerActive == '1') {
      await mailerService.sendMail({
        to: email,
        from: 'gabrielsantossousa774@gmail.com',
        subject: 'Código para alteração de senha - Trader',
        html: `<h3>Código: ${code}</h3>`,
      });
    }

    await this.prisma.$transaction(async () => {
      await this.prisma.user.update({
        where: { email },
        data: {
          password_reset_code: hash,
        },
      });
    });

    return { code: hash };
  }

  async updateUserPassword(
    email: string,
    password_reset_code: string,
    password: string,
  ) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { email },
    });

    if (user.password_reset_code) {
      const isCodeValid = await bcrypt.compare(
        password_reset_code,
        user.password_reset_code,
      );

      if (isCodeValid) {
        const hash = await bcrypt.hash(password, 10);

        console.log('aaa');
        return await this.prisma.user.update({
          where: {
            email,
          },
          data: { password: hash, password_reset_code: null },
        });
      }
    }

    return null;
  }
}
