import { Exclude } from 'class-transformer';
import { Cart } from '../../cart';

export class User {
  id: string;
  name: string;
  @Exclude()
  password: string;
  cart?: Cart;
}

export type UserDto = {
  name: string;
  password: string;
};
