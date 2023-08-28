import { PrismaService } from '../../../database/prisma.service';
import { StockRepository } from '../stock-repository';
import { Injectable } from '@nestjs/common';
import { Prisma, Stock, UserStocks } from '@prisma/client';

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
      await this.prisma.$executeRaw<any>`SELECT update_stocks(3)`;

      // stocks.map(async (stock) => {
      //   const random = Math.random();
      //   const variation = Math.round(Math.random() * 50);

      //   random > 0.5 ? (stock.value -= variation) : (stock.value += variation);

      //   if (stock.value < 50) stock.value = 50;

      //   if (stock.value > 10000) stock.value = 10000;

      //   return await this.prisma
      //     .$queryRaw`UPDATE "UserStocks" SET value = ${stock.value} WHERE id = ${stock.id}`;
      // });

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
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });

      const userStock = await this.prisma.userStocks.findUnique({
        where: { id: Number(userStockId) },
        select: { value: true, quantity: true },
      });

      if (userStock.quantity - quantity < 0 && !type)
        return { msg: 'Invalid quantity' };

      const newBalance = type
        ? user.balance - userStock.value * quantity
        : user.balance + userStock.value * quantity;

      if (newBalance < 0) return { msg: 'Not enough funds' };

      await this.prisma
        .$queryRaw`UPDATE "User" SET balance = ${newBalance} WHERE id = ${userId}`;

      const newQuantity = type
        ? userStock.quantity + quantity
        : userStock.quantity - quantity;

      await this.prisma
        .$queryRaw`UPDATE "UserStocks" SET quantity = ${newQuantity} WHERE id = ${userStockId}`;

      return {
        id: userStockId,
        new_balance: newBalance,
        new_quantity: newQuantity,
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
