import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

import { Cart, CartItemDto, CartStatuses } from '../src/cart';
import { PrismaService } from '../src/db/prisma.service';
import { createApp } from './fixtures/e2e';
import { generateBasicToken } from './helpers/token';
import { UserDto } from '../src/users';
import { OrderDto, OrderStatuses } from '../src/order';
import { CartResponse, OrderResponse } from '../src/shared';

const userDto: UserDto = {
  name: `Test${Math.random()}`,
  password: 'XXXX',
};
const cartItemDto: CartItemDto = {
  product_id: uuid(),
  count: 1,
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
    expect(response.body).toMatchObject(<CartResponse>{
      statusCode: 200,
      message: 'OK',
      data: {
        cart: {
          status: CartStatuses.OPEN,
          items: [],
        },
      },
    });
  });

  test('should update cart', async () => {
    const count = 1000;
    const updatedCount = 1001;

    const response = await request(app.getHttpServer())
      .put('/api/profile/cart')
      .set('Authorization', token)
      .send({ ...cartItemDto, count });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(<CartResponse>{
      statusCode: 200,
      message: 'OK',
      data: {
        cart: {
          status: CartStatuses.OPEN,
          items: [
            {
              product_id: cartItemDto.product_id,
              count,
            },
          ],
        },
      },
    });

    const updatedResponse = await request(app.getHttpServer())
      .put('/api/profile/cart')
      .set('Authorization', token)
      .send({ ...cartItemDto, count: updatedCount });

    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body).toMatchObject(<CartResponse>{
      statusCode: 200,
      message: 'OK',
      data: {
        cart: {
          status: CartStatuses.OPEN,
          items: [
            {
              product_id: cartItemDto.product_id,
              count: updatedCount,
            },
          ],
        },
      },
    });
  });

  test('should create order', async () => {
    const order: Pick<OrderDto, 'delivery'> = {
      delivery: {
        firstName: `first${userDto.name}`,
        lastName: `last${userDto.name}`,
        comment: 'test comment for delivery',
        address: 'test address for delivery',
      },
    };

    const cartResponse = await request(app.getHttpServer())
      .get('/api/profile/cart')
      .set('Authorization', token);
    const cart = (cartResponse.body as CartResponse).data.cart;

    const orderResponse = await request(app.getHttpServer())
      .post('/api/profile/cart/checkout')
      .set('Authorization', token)
      .send(order);

    expect(orderResponse.status).toBe(201);
    expect(orderResponse.body).toMatchObject(<OrderResponse>{
      statusCode: 201,
      message: 'OK',
      data: {
        order: {
          status: OrderStatuses.CREATED,
          delivery: order.delivery,
          cart: {
            id: cart.id,
            status: CartStatuses.ORDERED,
            items: cart.items,
          },
        },
      },
    });
  });
});
