import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockRepository } from './repositories/stock-repository';
import { PrismaStockRepository } from './repositories/prisma/prisma-stock-repository';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const uploadPath = './upload';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          cb(null, uploadPath);
        },
        filename: (req: any, file: any, cb: any) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [StockController],
  providers: [
    PrismaService,
    StockService,
    { provide: StockRepository, useClass: PrismaStockRepository },
  ],
  exports: [],
})
export class StockModule {}
