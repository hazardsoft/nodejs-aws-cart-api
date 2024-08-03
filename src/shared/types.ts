import { HttpStatus } from '@nestjs/common';
import { Cart } from '../cart';
import { Order } from '../order';

export type UserId = string;

export type Response<T> = {
  statusCode: HttpStatus;
  message: string;
  data?: T;
};

export type CartResponse = Response<{ cart: Cart }>;

export type OrderResponse = Response<{ order: Order }>;
