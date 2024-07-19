import { Injectable } from '@nestjs/common';
import { Cart, CartItemDto } from '../models';
import { PrismaService } from '../../db/prisma.service';
import { UserId } from '../../shared/types';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserId(userId: UserId): Promise<Cart> {
    return this.prismaService.findCartByUserId(userId);
  }

  async createByUserId(userId: UserId) {
    return this.prismaService.createCartByUserId(userId);
  }

  async findOrCreateByUserId(userId: UserId): Promise<Cart> {
    return this.prismaService.findOrCreateCartByUserId(userId);
  }

  async updateByUserId(userId: UserId, item: CartItemDto): Promise<Cart> {
    return this.prismaService.updateByUserId(userId, item);
  }

  async removeByUserId(userId: UserId): Promise<void> {
    return this.prismaService.removeCartByUserId(userId);
  }
}
