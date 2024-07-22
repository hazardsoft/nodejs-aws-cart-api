import { Injectable } from '@nestjs/common';
import { Cart, CartItemDto } from '../models';
import { PrismaService } from '../../db/prisma.service';
import { UserId } from '../../shared/types';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserId(userId: UserId): Promise<Cart> {
    return plainToClass(
      Cart,
      await this.prismaService.findCartByUserId(userId),
    );
  }

  async createByUserId(userId: UserId) {
    return plainToClass(
      Cart,
      await this.prismaService.createCartByUserId(userId),
    );
  }

  async findOrCreateByUserId(userId: UserId): Promise<Cart> {
    return plainToClass(
      Cart,
      await this.prismaService.findOrCreateCartByUserId(userId),
    );
  }

  async updateByUserId(userId: UserId, item: CartItemDto): Promise<Cart> {
    return plainToClass(Cart, this.prismaService.updateByUserId(userId, item));
  }
}
