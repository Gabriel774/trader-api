import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { randomUUID } from 'node:crypto';
import { userTestPassword } from '../prisma/constants';

describe('UserController (e2e)', () => {
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

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/users');

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body[0].id).toBe('number');
    expect(typeof response.body[0].name).toBe('string');
    expect(typeof response.body[0].email).toBe('string');
  });

  it('/users/rank (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/users/rank');

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body[0].balance).toBe('number');
    expect(typeof response.body[0].name).toBe('string');
  });

  it('/users/reset-code (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/reset-code')
      .send({
        email: 'teste@email.com',
      });

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body.code).toBe('string');
  });

  it('/users (POST)', async () => {
    const random = randomUUID();

    const response = await request(app.getHttpServer())
      .post('/users')
      .field('email', `${random}@test.com`)
      .field('name', random)
      .field('password', random);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body.id).toBe('number');
    expect(response.body.name).toBe(random);
    expect(response.body.email).toBe(`${random}@test.com`);
    expect(response.body.balance).toBe(10000);
    expect(response.body.profile_pic).toBe(null);

    const auth = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: `${random}@test.com`,
        password: random,
      });

    const token = auth.body.access_token;

    await request(app.getHttpServer())
      .delete('/users')
      .set('Authorization', `Bearer ${token}`);
  });

  it('/users (PUT)', async () => {
    const auth = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'teste@email.com',
      password: userTestPassword,
    });

    const token = auth.body.access_token;

    const name = randomUUID();

    const response = await request(app.getHttpServer())
      .put('/users')
      .field('name', name)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.body.name).toBe(name);
  });

  it('/users (DELETE)', async () => {
    const random = randomUUID();

    await request(app.getHttpServer())
      .post('/users')
      .field('email', `${random}@test.com`)
      .field('name', random)
      .field('password', random);

    const auth = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: `${random}@test.com`,
        password: random,
      });

    const token = auth.body.access_token;

    const response = await request(app.getHttpServer())
      .delete('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(204);
  });
});
