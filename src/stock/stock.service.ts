import { Injectable } from '@nestjs/common';
import { StockRepository } from './repositories/stock-repository';
import { Stock } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { supabase_credentials } from './constants';

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
      company_logo: any;
    },
  ): Promise<Stock> {
    const supabase = createClient(
      supabase_credentials.url,
      supabase_credentials.key,
    );

    const upload = await supabase.storage
      .from('trader-images')
      .upload(
        `public/${randomUUID()}${extname(
          attributes.company_logo.originalname,
        )}`,
        attributes.company_logo.buffer,
        {
          cacheControl: '3600',
          upsert: false,
        },
      );
    return await stockRepository.create({
      ...attributes,
      company_logo: upload.data.path,
    });
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
