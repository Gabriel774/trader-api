import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { userTestPassword } from '../prisma/constants';

describe('AuthController (e2e)', () => {
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

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        name: 'testerson',
        password: userTestPassword,
      });

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body.access_token).toBe('string');
  });

  it('/auth/me (GET)', async () => {
    const auth = await request(app.getHttpServer()).post('/auth/login').send({
      name: 'testerson',
      password: userTestPassword,
    });

    const token = auth.body.access_token;

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body.id).toBe('number');
    expect(typeof response.body.name).toBe('string');
    expect(typeof response.body.balance).toBe('number');
  });
});
