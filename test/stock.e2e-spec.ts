import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { userTestPassword } from '../prisma/constants';

describe('StockController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/stocks (GET)', async () => {
    const auth = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'teste@email.com',
      password: userTestPassword,
    });

    const token = auth.body.access_token;

    const response = await request(app.getHttpServer())
      .get('/stocks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body[0].id).toBe('number');
    expect(typeof response.body[0].name).toBe('string');
    expect(typeof response.body[0].initial_value).toBe('number');
  });

  it('/stocks/update-stocks-value (PUT)', async () => {
    const auth = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'teste@email.com',
      password: userTestPassword,
    });

    const token = auth.body.access_token;

    const response = await request(app.getHttpServer())
      .put('/stocks/update-stocks-value')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body[0].id).toBe('number');
    expect(typeof response.body[0].name).toBe('string');
    expect(typeof response.body[0].initial_value).toBe('number');
  });

  it('/stocks/update-stock-quantity (PUT)', async () => {
    const auth = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'teste@email.com',
      password: userTestPassword,
    });

    const token = auth.body.access_token;

    const response = await request(app.getHttpServer())
      .put('/stocks/update-stock-quantity')
      .send({
        stock_id: 465,
        quantity: 1,
        type: true,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body.new_balance).toBe('number');
    expect(typeof response.body.new_quantity).toBe('number');
  });
});
