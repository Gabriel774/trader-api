import { Stock } from '@prisma/client';

export abstract class StockRepository {
  abstract create(attributes: {
    name: string;
    initial_value: number;
    company_logo: string;
  }): Promise<Stock | null>;

  abstract update(
    id: number,
    attributes: {
      name?: string;
      initial_value?: number;
      company_logo?: string;
    },
  ): Promise<Stock | null>;

  abstract getAll(id: number): Promise<Stock[]>;

  abstract delete(id: number): Promise<Stock | null>;

  abstract updateStocksValue(id: number): Promise<Stock[]>;

  abstract updateStockQuantity(
    userId: number,
    userStockId: number,
    quantity: number,
    type: boolean,
  ): Promise<object>;
}
