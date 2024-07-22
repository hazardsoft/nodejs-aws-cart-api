import { User } from '../../users';
import { Cart } from '../../cart/models';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export enum OrderStatuses {
  CREATED = 'CREATED',
  SHIPPED = 'SHIPPED',
}

export class Order {
  id: string;
  @Exclude()
  user_id: string;
  @Exclude()
  user: User;
  @Exclude()
  cart_id: string;
  cart: Cart;
  delivery: Delivery;
  status: OrderStatuses;
}

export type Delivery = {
  firstName: string;
  lastName: string;
  address: string;
  comment: string;
};

export type OrderDto = Pick<Order, 'user_id' | 'cart_id' | 'delivery'>;

export class OrderInputDto {
  @IsNotEmpty()
  delivery: Delivery;
}
