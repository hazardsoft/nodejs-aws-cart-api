import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { PrismaModule } from '../db/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
