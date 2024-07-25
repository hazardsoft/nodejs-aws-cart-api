import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CartItemDto, CartStatuses } from '../cart/models';
import { UserId } from '../shared/types';
import { UserDto } from '../users/models';
import { OrderDto, OrderStatuses } from '../order/models';

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
          select: { product_id: true, count: true },
        },
      },
    });
    return foundCart;
  }

  async createCartByUserId(userId: UserId) {
    const createdCart = await this.cart.create({
      data: { user_id: userId },
      include: {
        items: {
          select: { product_id: true, count: true },
        },
      },
    });
    return createdCart;
  }

  async deleteCartByUserId(userId: UserId) {
    const deletedCart = await this.cart.deleteMany({
      where: { user_id: userId },
    });
    return deletedCart;
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
                product_id: updatedItem.product_id,
              },
            },
            create: {
              product_id: updatedItem.product_id,
              count: updatedItem.count,
            },
            update: { count: updatedItem.count },
          },
        },
        updated_at: new Date(),
      },
      include: {
        items: {
          select: { product_id: true, count: true },
        },
      },
    });

    return updatedCart;
  }

  async createUser(user: UserDto) {
    const createdUser = await this.user.create({ data: user });
    return createdUser;
  }

  async findUserById(userId: UserId) {
    const foundUser = await this.user.findUnique({ where: { id: userId } });
    return foundUser;
  }

  async findUserByName(name: string) {
    const foundUser = await this.user.findUnique({ where: { name } });
    return foundUser;
  }

  async deleteUser(userId: UserId) {
    const deletedUser = await this.user.delete({ where: { id: userId } });
    return deletedUser;
  }

  async createOrder(orderDto: OrderDto) {
    const [createdOrder, updatedCart] = await this.$transaction([
      this.order.create({
        data: orderDto,
        include: {
          cart: false,
        },
      }),
      this.cart.update({
        where: { id: orderDto.cart_id },
        data: { status: CartStatuses.ORDERED, updated_at: new Date() },
        select: {
          id: true,
          status: true,
          items: {
            select: { product_id: true, count: true },
          },
        },
      }),
    ]);
    return { ...createdOrder, cart: { ...updatedCart } };
  }
}
