import { User, UserDto } from '../src/users';
import { CartStatuses, ProductDto } from '../src/cart';
import { PrismaService } from '../src/db/prisma.service';
import { calculateCartTotal } from '../src/cart/models-rules';
import { OrderStatuses } from '../src/order';

const userDto: UserDto = {
  name: `testuser${Math.random()}`,
  password: 'password',
};
const productDto: ProductDto = {
  title: 'Test title',
  description: 'Test description',
  price: 100,
  image: 'https://images.com?image=123.png',
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
    expect(user.password).toBeUndefined();

    const cart = await prismaService.createCartByUserId(user.id);
    expect(cart.id).toBeTruthy();
    expect(cart.user_id).toBe(user.id);
    expect(cart.status).toBe(CartStatuses.OPEN);
    expect(cart.items.length).toBe(0);

    const product = await prismaService.createProduct(productDto);
    expect(product.id).toBeTruthy();
    expect(product.title).toBe(productDto.title);
    expect(product.description).toBe(productDto.description);
    expect(product.image).toBe(productDto.image);

    const updatedCart = await prismaService.updateByUserId(user.id, {
      product,
      count: 1000,
    });
    expect(updatedCart.items.length).toBe(1);
    expect(updatedCart.items[0].product.id).toBe(product.id);
    expect(updatedCart.items[0].count).toBe(1000);

    const updatedCart2 = await prismaService.updateByUserId(user.id, {
      product,
      count: 1001,
    });
    expect(updatedCart2.items.length).toBe(1);
    expect(updatedCart2.items[0].product.id).toBe(product.id);
    expect(updatedCart2.items[0].count).toBe(1001);

    const createdOrder = await prismaService.createOrder({
      user_id: user.id,
      cart_id: updatedCart.id,
      address: {
        firstName: `first${user.name}`,
        lastName: `last${user.name}`,
        address: 'test address',
        comment: 'test comment',
      },
      total: calculateCartTotal(updatedCart),
    });

    expect(createdOrder.id).toBeTruthy();
    expect(createdOrder.user_id).toBe(user.id);
    expect(createdOrder.cart_id).toBe(updatedCart.id);
    expect(createdOrder.status).toBe(OrderStatuses.CREATED);

    await prismaService.deleteUser(user.id);
    const deletedCart = await prismaService.findCartByUserId(user.id);
    expect(deletedCart).toBeNull();
  });
});
