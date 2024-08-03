import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  Post,
  UseGuards,
  HttpStatus,
  Delete,
} from '@nestjs/common';

import { BasicAuthGuard } from '../auth';
import { OrderInputDto, OrderService } from '../order';
import {
  AppRequest,
  getUserIdFromRequest,
  CartResponse,
  OrderResponse,
} from '../shared';
import { CartService } from './services';
import { CartItemDto } from './models';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest): Promise<CartResponse> {
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart },
    };
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(
    @Req() req: AppRequest,
    @Body() updatedItemDto: CartItemDto,
  ): Promise<CartResponse> {
    const cart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      updatedItemDto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart },
    };
  }

  @UseGuards(BasicAuthGuard)
  @Delete()
  clearUserCart(@Req() req: AppRequest) {
    this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'OK',
    };
  }

  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(
    @Req() req: AppRequest,
    @Body() orderDto: OrderInputDto,
  ): Promise<OrderResponse> {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode;

      return {
        statusCode,
        message: 'Cart is empty',
      };
    }

    const { delivery } = orderDto;
    const order = await this.orderService.create({
      user_id: userId,
      cart_id: cart.id,
      delivery,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'OK',
      data: { order },
    };
  }
}
