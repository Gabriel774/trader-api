import { Injectable } from '@nestjs/common';
import { StockRepository } from './repositories/stock-repository';
import { Stock } from '@prisma/client';

@Injectable()
export class StockService {
  async getAll(stockRepository: StockRepository, id: number): Promise<Stock[]> {
    return await stockRepository.getAll(id);
  }

  async create(
    stockRepository: StockRepository,
    data: {
      name: string;
      initial_value: Number;
      company_logo: string;
    },
  ): Promise<Stock> {
    return await stockRepository.create(data);
  }
  async update(
    stockRepository: StockRepository,
    id: number,
    data: {
      name?: string;
      initial_value?: Number;
      company_logo?: string;
    },
  ): Promise<Stock> {
    return await stockRepository.update(id, data);
  }

  async delete(
    stockRepository: StockRepository,
    id: number,
  ): Promise<Stock | null> {
    return await stockRepository.delete(id);
  }

  async updateStocksValue(
    stockRepository: StockRepository,
    id: number,
  ): Promise<Stock[]> {
    return await stockRepository.updateStocksValue(id);
  }

  async updateStockQuantity(
    stockRepository: StockRepository,
    user_id: number,
    stock_id: number,
    quantity: number,
    type: boolean,
  ): Promise<Object> {
    return await stockRepository.updateStockQuantity(
      user_id,
      stock_id,
      quantity,
      type,
    );
  }
}
