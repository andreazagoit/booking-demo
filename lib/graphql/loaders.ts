import DataLoader from "dataloader"
import { BatchGetCommand } from "@aws-sdk/lib-dynamodb"
import { docClient } from "@/lib/dynamodb"
import { PROPERTIES_TABLE, type PropertyItem } from "@/lib/models/property/operations"

const AUTH_TABLE_PREFIX = process.env.AUTH_TABLE_PREFIX ?? "auth_"
const AUTH_USER_TABLE = `${AUTH_TABLE_PREFIX}user`

type UserRecord = { id: string; name: string; email: string; createdAt: string }

function createPropertyLoader() {
  return new DataLoader<string, PropertyItem | null>(async (ids) => {
    const keys = [...new Set(ids)].map((id) => ({ id }))
    const result = await docClient.send(
      new BatchGetCommand({
        RequestItems: { [PROPERTIES_TABLE]: { Keys: keys } },
      })
    )
    const items = (result.Responses?.[PROPERTIES_TABLE] ?? []) as PropertyItem[]
    const map = Object.fromEntries(items.map((p) => [p.id, p]))
    return ids.map((id) => map[id] ?? null)
  })
}

function createUserLoader() {
  return new DataLoader<string, UserRecord | null>(async (ids) => {
    const keys = [...new Set(ids)].map((id) => ({ id }))
    const result = await docClient.send(
      new BatchGetCommand({
        RequestItems: { [AUTH_USER_TABLE]: { Keys: keys } },
      })
    )
    const items = (result.Responses?.[AUTH_USER_TABLE] ?? []) as Record<string, unknown>[]
    const map = Object.fromEntries(
      items.map((u) => [
        u.id as string,
        {
          id: u.id as string,
          name: (u.name as string) ?? "",
          email: u.email as string,
          createdAt: (u.createdAt as string) ?? new Date().toISOString(),
        },
      ])
    )
    return ids.map((id) => map[id] ?? null)
  })
}

export interface Loaders {
  property: ReturnType<typeof createPropertyLoader>
  user: ReturnType<typeof createUserLoader>
}

export function createLoaders(): Loaders {
  return {
    property: createPropertyLoader(),
    user: createUserLoader(),
  }
}
