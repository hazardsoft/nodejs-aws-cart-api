export const createDatabaseUrl = (
  username: string,
  password: string,
  host: string,
  port: number
) => {
  return `postgresql://${username}:${password}@${host}:${port}/${username}?schema=public`
}
