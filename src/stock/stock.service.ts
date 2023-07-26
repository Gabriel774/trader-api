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
    attributes: {
      name: string;
      initial_value: Number;
      company_logo: string;
    },
  ): Promise<Stock> {
    return await stockRepository.create(attributes);
  }

  async update(
    stockRepository: StockRepository,
    id: number,
    attributes: {
      name?: string;
      initial_value?: Number;
      company_logo?: string;
    },
  ): Promise<Stock> {
    return await stockRepository.update(id, attributes);
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
    attributes: {
      user_id: number;
      stock_id: number;
      quantity: number;
      type: boolean;
    },
  ): Promise<Object> {
    console.log(attributes);
    return await stockRepository.updateStockQuantity(
      attributes.user_id,
      attributes.stock_id,
      attributes.quantity,
      attributes.type,
    );
  }
}
