import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return { msg: 'Bem vindo a API do Trader!' };
  }
}
