import { UserDto } from '../src/users';
import { CartItemDto, CartStatuses } from '../src/cart';
import { PrismaService } from '../src/db/prisma.service';
import { OrderDto, OrderStatuses } from '../src/order';
import { v4 as uuid } from 'uuid';
import exp from 'constants';

const userDto: UserDto = {
  name: `testuser${Math.random()}`,
  password: 'password',
};
const cartItemDto: CartItemDto = {
  product_id: uuid(),
  count: 1,
};

describe('PrismaService (e2e)', () => {
  let prismaService: PrismaService;

  beforeAll(async () => {
    prismaService = new PrismaService();
    await prismaService.$connect();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  test('should created cart', async () => {
    const user = await prismaService.createUser(userDto);
    expect(user.id).toBeTruthy();
    expect(user.name).toBe(userDto.name);
    expect(user.password).toBe(userDto.password);

    const cart = await prismaService.createCartByUserId(user.id);
    expect(cart.id).toBeTruthy();
    expect(cart.user_id).toBe(user.id);
    expect(cart.status).toBe(CartStatuses.OPEN);
    expect(cart.items.length).toBe(0);

    const updatedCart = await prismaService.updateByUserId(
      user.id,
      cartItemDto,
    );
    expect(updatedCart.items.length).toBe(1);
    expect(updatedCart.items[0].product_id).toBe(cartItemDto.product_id);
    expect(updatedCart.items[0].count).toBe(cartItemDto.count);

    const updatedCart2 = await prismaService.updateByUserId(user.id, {
      ...cartItemDto,
      count: 1001,
    });
    expect(updatedCart2.items.length).toBe(1);
    expect(updatedCart2.items[0].product_id).toBe(cartItemDto.product_id);
    expect(updatedCart2.items[0].count).toBe(1001);

    const orderDto: OrderDto = {
      user_id: user.id,
      cart_id: updatedCart.id,
      delivery: {
        firstName: `first${user.name}`,
        lastName: `last${user.name}`,
        address: 'test address',
        comment: 'test comment',
      },
    };

    const createdOrder = await prismaService.createOrder(orderDto);

    expect(createdOrder.id).toBeTruthy();
    expect(createdOrder.user_id).toBe(user.id);
    expect(createdOrder.cart_id).toBe(updatedCart.id);
    expect(createdOrder.status).toBe(OrderStatuses.CREATED);
    expect(createdOrder.delivery).toMatchObject(orderDto.delivery);
    expect(createdOrder.cart).toMatchObject({
      id: updatedCart2.id,
      status: CartStatuses.ORDERED,
      items: updatedCart2.items,
    });

    await prismaService.deleteUser(user.id);
    const deletedCart = await prismaService.findCartByUserId(user.id);
    expect(deletedCart).toBeNull();
  });
});
