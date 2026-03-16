import { GetCommand } from "@aws-sdk/lib-dynamodb"
import { docClient } from "@/lib/dynamodb"

const AUTH_TABLE_PREFIX = process.env.AUTH_TABLE_PREFIX ?? "auth_"

export async function dbGetUserById(id: string): Promise<{ id: string; name: string; email: string; createdAt: string } | null> {
  const result = await docClient.send(
    new GetCommand({ TableName: `${AUTH_TABLE_PREFIX}user`, Key: { id } })
  )
  if (!result.Item) return null
  const u = result.Item as Record<string, unknown>
  return {
    id: u.id as string,
    name: (u.name as string) ?? "",
    email: u.email as string,
    createdAt: (u.createdAt as string) ?? new Date().toISOString(),
  }
}
