import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

const createApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  return moduleFixture.createNestApplication();
};

const getUserToken = async (app: INestApplication) => {
  const response = await request(app.getHttpServer()).post('/api/auth/login');
  return response.body.data.access_token;
};

export { createApp, getUserToken };
