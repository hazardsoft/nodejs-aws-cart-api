export const config = {
  database: {
    credentials: {
      username: process.env.DATABASE_USERNAME ?? '',
      password: process.env.DATABASE_PASSWORD ?? ''
    },
    id: process.env.DATABASE_ID ?? '',
    host: process.env.DATABASE_HOST ?? '',
    port: Number(process.env.DATABASE_PORT ?? 5432),
    url: process.env.DATABASE_URL ?? ''
  }
}
