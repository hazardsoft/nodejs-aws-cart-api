export const config = {
  database: {
    credentials: {
      username: process.env.DATABASE_USERNAME ?? '',
      password: process.env.DATABASE_PASSWORD ?? ''
    },
    host: process.env.DATABASE_HOST ?? '',
    port: Number(process.env.DATABASE_PORT ?? 5432),
    url: process.env.DATABASE_URL ?? ''
  }
}
