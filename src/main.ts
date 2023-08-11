import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = {
    allowedHeaders: ['content-type', 'multipart/form-data'],
    origin: ['http://localhost:3000', 'https://trader-app-ten.vercel.app/'],
    credentials: true,
  };

  app.enableCors(options);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3333);
}
bootstrap();
