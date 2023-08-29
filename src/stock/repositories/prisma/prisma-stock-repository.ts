import { PrismaService } from '../../../database/prisma.service';
import { StockRepository } from '../stock-repository';
import { Injectable } from '@nestjs/common';
import { Prisma, Stock } from '@prisma/client';

@Injectable()
export class PrismaStockRepository implements StockRepository {
  constructor(private prisma: PrismaService) {}

  async getAll(id: number): Promise<Stock[]> {
    return await this.prisma.stock.findMany({
      include: { UserStocks: { where: { userId: id } } },
    });
  }

  async create(attributes: {
    name: string;
    initial_value: number;
    company_logo: string;
  }): Promise<Stock | null> {
    try {
      return await this.prisma.$transaction(async () => {
        const res = await this.prisma.stock.create({
          data: {
            name: attributes.name,
            initial_value: attributes.initial_value,
            company_logo: attributes.company_logo,
          },
        });

        const users = await this.prisma.user.findMany();

        if (users.length > 0) {
          const rows = [];

          users.map(async (user) =>
            rows.push([res.id, user.id, res.initial_value]),
          );

          await this.prisma
            .$queryRaw`INSERT INTO "UserStocks"( "stockId", "userId", value )  VALUES ${Prisma.join(
            rows.map((row) => Prisma.sql`(${Prisma.join(row)})`),
          )};`;
        }

        return res;
      });
    } catch (err) {
      return null;
    }
  }

  async update(
    id: number,
    attributes: {
      name?: string;
      initial_value?: number;
      company_logo?: string;
    },
  ): Promise<Stock | null> {
    try {
      return await this.prisma.stock.update({
        where: { id: Number(id) },
        data: {
          ...attributes,
        },
      });
    } catch (err) {
      return null;
    }
  }

  async delete(id: number): Promise<Stock | null> {
    try {
      return await this.prisma.stock.delete({ where: { id } });
    } catch (err) {
      return null;
    }
  }

  async updateStocksValue(id: number): Promise<Stock[]> {
    try {
      await this.prisma.$executeRaw`SELECT update_stocks(${id})`;

      return await this.getAll(id);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async updateStockQuantity(
    userId: number,
    userStockId: number,
    quantity: number,
    type: boolean,
  ): Promise<object> {
    try {
      await this.prisma.$executeRaw`SELECT update_stock_quantity(
          ${userId}, 
          ${userStockId}, 
          ${quantity},
          ${type}
        )`;

      const new_balance = await this.prisma
        .$queryRaw`SELECT balance from "User" where id = ${userId}`.then(
        (res: { balance: number }[]) => res[0].balance,
      );

      const new_quantity = await this.prisma
        .$queryRaw`SELECT quantity from "UserStocks" where id = ${userStockId}`.then(
        (res: { quantity: number }[]) => res[0].quantity,
      );

      return {
        id: userStockId,
        new_balance,
        new_quantity,
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
