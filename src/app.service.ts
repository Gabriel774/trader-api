import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Object {
    return { msg: 'Bem vindo a API do Trader!' };
  }
}
