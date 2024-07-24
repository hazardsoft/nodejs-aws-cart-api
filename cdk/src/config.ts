export const config = {
  database: {
    credentials: {
      username: process.env.DATABASE_USERNAME ?? '',
      password: process.env.DATABASE_PASSWORD ?? ''
    }
  },
  handlers: {
    timeout: 10
  }
}
