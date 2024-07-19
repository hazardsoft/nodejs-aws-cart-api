import { Exclude, Transform } from 'class-transformer';

export enum CartStatuses {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

export class Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export type ProductDto = Omit<Product, 'id'>;

export class CartItem {
  @Exclude()
  card_id: string;
  @Exclude()
  product_id: string;
  product?: Product;
  count: number;
}

export type CartItemDto = {
  product: Product;
  count: number;
};

export class Cart {
  id: string;
  user_id: string;
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value,
  )
  created_at: string;
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value,
  )
  updated_at: string;
  status: CartStatuses;
  items: CartItem[];
}
