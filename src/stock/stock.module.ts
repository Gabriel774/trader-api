import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockRepository } from './repositories/stock-repository';
import { PrismaStockRepository } from './repositories/prisma/prisma-stock-repository';

@Module({
  imports: [],
  controllers: [StockController],
  providers: [
    PrismaService,
    StockService,
    { provide: StockRepository, useClass: PrismaStockRepository },
  ],
  exports: [],
})
export class StockModule {}
