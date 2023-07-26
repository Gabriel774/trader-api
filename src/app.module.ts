import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from './stock/stock.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { smtp } from './constants';

@Module({
  imports: [
    UserModule,
    AuthModule,
    StockModule,
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: smtp.server,
        secure: false,
        port: smtp.port,
        auth: {
          user: smtp.user,
          pass: smtp.password,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
