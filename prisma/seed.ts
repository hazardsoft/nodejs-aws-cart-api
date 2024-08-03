import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.cartItem.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: 'johndoe',
      password: 'password',
    },
  });
  console.log('user created:', user);

  const cart = await prisma.cart.create({
    data: {
      user_id: user.id,
    },
  });
  console.log('cart created:', cart);

  const cartItem = await prisma.cartItem.create({
    data: {
      cart_id: cart.id,
      product_id: uuid(),
      count: 2,
    },
  });
  console.log('cart item created:', cartItem);
}

main()
  .then(async () => {
    console.log('Seeding completed');
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
