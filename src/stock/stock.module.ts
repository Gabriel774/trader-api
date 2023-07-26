import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockRepository } from './repositories/stock-repository';
import { PrismaStockRepository } from './repositories/prisma/prisma-stock-repository';
import { Supabase } from '../supabase/supabase';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  imports: [],
  controllers: [StockController],
  providers: [
    PrismaService,
    StockService,
    SupabaseService,
    Supabase,
    { provide: StockRepository, useClass: PrismaStockRepository },
  ],
  exports: [],
})
export class StockModule {}
