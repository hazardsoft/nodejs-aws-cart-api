import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';

import {
  Cart,
  CartItemDto,
  CartStatuses,
  Product,
  ProductDto,
} from '../cart/models';
import { UserId } from '../shared/types';
import { UserDto, User } from '../users/models';
import { Order, OrderDto } from '../order/models';

@Injectable()
export class PrismaService extends PrismaClient {
  async findCartByUserId(userId: UserId) {
    const foundCart = await this.cart.findFirst({
      where: {
        user_id: userId,
        status: CartStatuses.OPEN,
      },
      include: {
        items: {
          select: {
            product: true,
            count: true,
          },
        },
      },
    });
    return plainToClass(Cart, foundCart);
  }

  async createCartByUserId(userId: UserId) {
    const createdCart = await this.cart.create({
      data: { user_id: userId },
      include: {
        items: {
          select: {
            product: true,
            count: true,
          },
        },
      },
    });
    return plainToClass(Cart, createdCart);
  }

  async findOrCreateCartByUserId(userId: UserId) {
    return (
      (await this.findCartByUserId(userId)) ??
      (await this.createCartByUserId(userId))
    );
  }

  async updateByUserId(userId: string, updatedItem: CartItemDto) {
    const cart = await this.findOrCreateCartByUserId(userId);

    const updatedCart = await this.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          upsert: {
            where: {
              cart_id_product_id: {
                cart_id: cart.id,
                product_id: updatedItem.product.id,
              },
            },
            create: {
              product_id: updatedItem.product.id,
              count: updatedItem.count,
            },
            update: { count: updatedItem.count },
          },
        },
      },
      include: {
        items: {
          select: {
            product: true,
            count: true,
          },
        },
      },
    });

    return plainToClass(Cart, updatedCart);
  }

  async createUser(user: UserDto): Promise<User> {
    const createdUser = await this.user.create({ data: user });
    return plainToClass(User, createdUser);
  }

  async findUserById(userId: UserId): Promise<User> {
    const foundUser = await this.user.findUnique({ where: { id: userId } });
    return plainToClass(User, foundUser);
  }

  async findUserByName(name: string): Promise<User> {
    const foundUser = await this.user.findUnique({ where: { name } });
    return plainToClass(User, foundUser);
  }

  async deleteUser(userId: UserId): Promise<void> {
    await this.user.delete({ where: { id: userId } });
  }

  async createProduct(product: ProductDto): Promise<Product> {
    const createProduct = await this.product.create({ data: product });
    return plainToClass(Product, createProduct);
  }

  async createOrder(orderDto: OrderDto): Promise<Order> {
    const results = await this.$transaction([
      this.order.create({
        data: orderDto,
        include: {
          cart: {
            select: { items: { select: { product: true, count: true } } },
          },
        },
      }),
      this.cart.update({
        where: { id: orderDto.cart_id },
        data: { status: CartStatuses.ORDERED },
      }),
    ]);
    const createdOrder = results[0];
    return plainToClass(Order, createdOrder);
  }
}
