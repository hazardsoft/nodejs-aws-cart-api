import { Injectable } from '@nestjs/common';

import { Order, OrderDto } from '../models';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(order: OrderDto): Promise<Order> {
    return this.prismaService.createOrder(order);
  }
}
