import { Injectable } from '@nestjs/common';

import { Order, OrderDto } from '../models';
import { PrismaService } from '../../db/prisma.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(order: OrderDto): Promise<Order> {
    return plainToClass(Order, await this.prismaService.createOrder(order));
  }
}
