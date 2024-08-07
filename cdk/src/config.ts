export const config = {
  account: {
    id: process.env.CDK_DEFAULT_ACCOUNT ?? '',
    region: process.env.CDK_DEFAULT_REGION ?? ''
  },
  database: {
    credentials: {
      username: process.env.DATABASE_USERNAME ?? '',
      password: process.env.DATABASE_PASSWORD ?? ''
    }
  },
  servers: {
    cart: {
      url: process.env.CART_SERVICE_URL ?? ''
    }
  },
  handlers: {
    timeout: 10
  }
}
