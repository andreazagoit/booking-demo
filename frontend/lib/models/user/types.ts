export const AUTH_TABLE_PREFIX = process.env.AUTH_TABLE_PREFIX ?? "auth_"
export const AUTH_USER_TABLE = `${AUTH_TABLE_PREFIX}user`

export type UserRecord = {
  id: string
  name: string
  email: string
  createdAt: string
}
