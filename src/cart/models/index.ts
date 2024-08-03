import { Exclude, Transform } from 'class-transformer';
import { IsInt, IsUUID, Min } from 'class-validator';

export enum CartStatuses {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

export class CartItem {
  @Exclude()
  card_id: string;
  product_id: string;
  count: number;
}

export class CartItemDto {
  @IsUUID()
  product_id: string;
  @IsInt()
  @Min(1)
  count: number;
}

export class Cart {
  id: string;
  @Exclude()
  user_id: string;
  @Exclude()
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value,
  )
  created_at: string;
  @Exclude()
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value,
  )
  updated_at: string;
  status: CartStatuses;
  items: CartItem[];
}
