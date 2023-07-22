import { PrismaService } from '../../../database/prisma.service';
import { StockRepository } from '../stock-repository';
import { Injectable } from '@nestjs/common';
import { Stock } from '@prisma/client';
import { unlinkSync } from 'node:fs';

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

        users.map(
          async (user) =>
            await this.prisma
              .$queryRaw`INSERT INTO UserStocks( stockId, userId, value ) VALUES ( ${res.id}, ${user.id}, ${res.initial_value} );`,
        );
        return res;
      });
    } catch (err) {
      unlinkSync(`upload/${attributes.company_logo}`);
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
      if (attributes.company_logo)
        unlinkSync(`upload/${attributes.company_logo}`);
      return null;
    }
  }

  async delete(id: number): Promise<Stock | null> {
    try {
      const res = await this.prisma.stock.delete({ where: { id } });

      unlinkSync(`upload/${res.company_logo}`);

      return await this.prisma.stock.delete({ where: { id } });
    } catch (err) {
      return null;
    }
  }

  async updateStocksValue(id: number): Promise<Stock[]> {
    try {
      await this.prisma.$transaction(async () => {
        const user = await this.prisma.user.findFirstOrThrow({
          where: { id },
          include: { UserStocks: true },
        });

        const stocks = [...user.UserStocks];

        const res = stocks.map((stock) => {
          let random = Math.random();
          let variation = Math.round(Math.random() * 50);

          random > 0.5
            ? (stock.value -= variation)
            : (stock.value += variation);

          if (stock.value < 1) stock.value = 1;

          return stock;
        });

        res.map(async (stock) => {
          return await this.prisma
            .$queryRaw`UPDATE UserStocks SET value = ${stock.value} WHERE id = ${stock.id}`;
        });
      });

      return await this.getAll(id);
    } catch (err) {
      return err;
    }
  }

  async updateStockQuantity(
    userId: number,
    userStockId: number,
    quantity: number,
    type: boolean,
  ): Promise<Object> {
    try {
      return await this.prisma.$transaction(async () => {
        const user = await this.prisma.user.findFirstOrThrow({
          where: { id: userId },
        });
        const userStock = await this.prisma.userStocks.findFirstOrThrow({
          where: { id: userStockId },
        });

        if (userStock.quantity - quantity < 0 && !type)
          return { msg: 'Invalid quantity' };

        const newBalance = type
          ? user.balance - userStock.value * quantity
          : user.balance + userStock.value * quantity;

        if (newBalance < 0) return { msg: 'Not enough funds' };

        await this.prisma.user.update({
          where: { id: userId },
          data: {
            balance: newBalance,
          },
        });

        const newQuantity = type
          ? userStock.quantity + quantity
          : userStock.quantity - quantity;

        await this.prisma.userStocks.update({
          where: { id: userStockId },
          data: {
            quantity: newQuantity,
          },
        });

        return {
          id: userStockId,
          new_balance: newBalance,
          new_quantity: newQuantity,
        };
      });
    } catch (err) {
      return err;
    }
  }
}
