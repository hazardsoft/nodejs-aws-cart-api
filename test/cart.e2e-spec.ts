import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { CartStatuses } from '../src/cart';
import { PrismaService } from '../src/db/prisma.service';
import { createApp } from './fixtures/e2e';
import { generateBasicToken } from './helpers/token';
import { UserDto } from '../src/users';

const userDto: UserDto = {
  name: `Test${Math.random()}`,
  password: 'XXXX',
};

const token = generateBasicToken(userDto.name, userDto.password);

describe('CartController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    prismaService = new PrismaService();
    await prismaService.$connect();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  beforeEach(async () => {
    app = await createApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  test('should create cart', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/profile/cart')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      statusCode: 200,
      message: 'OK',
      data: {
        cart: {
          status: CartStatuses.OPEN,
          items: [],
        },
        total: 0,
      },
    });
  });

  test('should update cart', async () => {
    const product = await prismaService.product.findFirst();
    const count = 1000;
    const updatedCount = 1001;

    const response = await request(app.getHttpServer())
      .put('/api/profile/cart')
      .set('Authorization', token)
      .send({ product, count });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      statusCode: 200,
      message: 'OK',
      data: {
        cart: {
          status: CartStatuses.OPEN,
          items: [
            {
              product: { id: product.id },
              count,
            },
          ],
        },
        total: product.price * count,
      },
    });

    const updatedResponse = await request(app.getHttpServer())
      .put('/api/profile/cart')
      .set('Authorization', token)
      .send({ product, count: updatedCount });

    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body).toMatchObject({
      statusCode: 200,
      message: 'OK',
      data: {
        cart: {
          status: CartStatuses.OPEN,
          items: [
            {
              product: { id: product.id },
              count: updatedCount,
            },
          ],
        },
        total: product.price * updatedCount,
      },
    });
  });
});
