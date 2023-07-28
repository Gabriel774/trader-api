import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [UserModule, AuthModule, StockModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
