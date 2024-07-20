import { User } from '../../users';
import { Cart } from '../../cart/models';

export enum OrderStatuses {
  CREATED = 'CREATED',
  SHIPPED = 'SHIPPED',
}

export class Order {
  id: string;
  user_id: string;
  user: User;
  cart_id: string;
  cart: Cart;
  address: {
    firstName: string;
    lastName: string;
    address: string;
    comment: string;
  };
  status: string;
  total: number;
}

export type OrderDto = Pick<
  Order,
  'user_id' | 'cart_id' | 'address' | 'total'
>;
