import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.product.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.cartItem.deleteMany();

  const product = await prisma.product.create({
    data: {
      title: 'Title from Prisma',
      description: 'Description from Prisma',
      price: 99.99,
      count: 9,
      image:
        'https://www.dropbox.com/scl/fi/86ygbkrhtngnhji1h16x3/the-peripheral.jpeg?rlkey=l7rcibcq7bzek12q3wmni7f1e&dl=1',
    },
  });
  console.log('product created:', product);

  const cart = await prisma.cart.create({
    data: {},
  });
  console.log('cart created:', cart);

  const cartItem = await prisma.cartItem.create({
    data: {
      cart_id: cart.id,
      product_id: product.id,
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
