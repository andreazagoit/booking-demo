import { createAdapterFactory } from "better-auth/adapters"
import type { CustomAdapter, CleanedWhere } from "@better-auth/core/db/adapter"
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb"
import { docClient } from "@/lib/dynamodb"

const TABLE_PREFIX = process.env.AUTH_TABLE_PREFIX ?? "auth_"

const tbl = (model: string) => `${TABLE_PREFIX}${model}`

function buildFilter(where: CleanedWhere[]) {
  const parts: string[] = []
  const names: Record<string, string> = {}
  const values: Record<string, unknown> = {}
  where.forEach((c, i) => {
    const n = `#f${i}`, v = `:v${i}`
    names[n] = c.field
    values[v] = c.value
    const op = c.operator ?? "eq"
    if (op === "eq") parts.push(`${n} = ${v}`)
    else if (op === "ne") parts.push(`${n} <> ${v}`)
    else if (op === "contains") parts.push(`contains(${n}, ${v})`)
    else parts.push(`${n} = ${v}`)
  })
  return { expression: parts.join(" AND "), names, values }
}

async function scan(model: string, where?: CleanedWhere[]): Promise<Record<string, unknown>[]> {
  if (!where || where.length === 0) {
    const r = await docClient.send(new ScanCommand({ TableName: tbl(model) }))
    return (r.Items ?? []) as Record<string, unknown>[]
  }
  const { expression, names, values } = buildFilter(where)
  const r = await docClient.send(new ScanCommand({
    TableName: tbl(model),
    FilterExpression: expression,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
  }))
  return (r.Items ?? []) as Record<string, unknown>[]
}

async function findOne(model: string, where: CleanedWhere[]): Promise<Record<string, unknown> | null> {
  if (where.length === 1 && where[0].field === "id" && !where[0].operator) {
    const r = await docClient.send(new GetCommand({ TableName: tbl(model), Key: { id: where[0].value } }))
    return (r.Item as Record<string, unknown>) ?? null
  }
  const items = await scan(model, where)
  return items[0] ?? null
}

export const dynamodbAdapter = () =>
  createAdapterFactory({
    config: {
      adapterId: "dynamodb",
      adapterName: "DynamoDB Adapter",
      usePlural: false,
      supportsJSON: false,
      supportsDates: false,
      supportsBooleans: false,
    },
    adapter: (): CustomAdapter => ({
      create: async ({ model, data }) => {
        await docClient.send(new PutCommand({ TableName: tbl(model), Item: data }))
        return data
      },

      update: async <T>({ model, where, update }: { model: string; where: CleanedWhere[]; update: T }): Promise<T | null> => {
        const existing = await findOne(model, where)
        if (!existing) return null
        const keys = Object.keys(update as Record<string, unknown>)
        if (!keys.length) return existing as unknown as T
        const setExpr = keys.map((k, i) => `#u${i} = :u${i}`).join(", ")
        const upd = update as Record<string, unknown>
        const exprNames = Object.fromEntries(keys.map((k, i) => [`#u${i}`, k]))
        const exprValues = Object.fromEntries(keys.map((k, i) => [`:u${i}`, upd[k]]))
        const r = await docClient.send(new UpdateCommand({
          TableName: tbl(model),
          Key: { id: existing.id },
          UpdateExpression: `SET ${setExpr}`,
          ExpressionAttributeNames: exprNames,
          ExpressionAttributeValues: exprValues,
          ReturnValues: "ALL_NEW",
        }))
        return (r.Attributes ?? null) as unknown as T | null
      },

      updateMany: async ({ model, where, update }) => {
        const items = await scan(model, where)
        for (const item of items) {
          const keys = Object.keys(update)
          if (!keys.length) continue
          const setExpr = keys.map((k, i) => `#u${i} = :u${i}`).join(", ")
          await docClient.send(new UpdateCommand({
            TableName: tbl(model),
            Key: { id: item.id },
            UpdateExpression: `SET ${setExpr}`,
            ExpressionAttributeNames: Object.fromEntries(keys.map((k, i) => [`#u${i}`, k])),
            ExpressionAttributeValues: Object.fromEntries(keys.map((k, i) => [`:u${i}`, update[k]])),
          }))
        }
        return items.length
      },

      delete: async ({ model, where }) => {
        const existing = await findOne(model, where)
        if (!existing) return
        await docClient.send(new DeleteCommand({ TableName: tbl(model), Key: { id: existing.id } }))
      },

      deleteMany: async ({ model, where }) => {
        const items = await scan(model, where)
        for (const item of items) {
          await docClient.send(new DeleteCommand({ TableName: tbl(model), Key: { id: item.id } }))
        }
        return items.length
      },

      findOne: async <T>({ model, where }: { model: string; where: CleanedWhere[]; select?: string[]; join?: unknown }): Promise<T | null> => {
        return (await findOne(model, where)) as unknown as T | null
      },

      findMany: async <T>({ model, where, limit, offset, sortBy }: { model: string; where?: CleanedWhere[]; limit?: number; offset?: number; sortBy?: { field: string; direction?: "asc" | "desc" }; select?: string[]; join?: unknown }): Promise<T[]> => {
        let items = await scan(model, where)
        if (sortBy) {
          items = [...items].sort((a, b) => {
            const dir = sortBy.direction === "desc" ? -1 : 1
            return a[sortBy.field]! > b[sortBy.field]! ? dir : a[sortBy.field]! < b[sortBy.field]! ? -dir : 0
          })
        }
        if (offset) items = items.slice(offset)
        if (limit) items = items.slice(0, limit)
        return items as unknown as T[]
      },

      count: async ({ model, where }) => {
        return (await scan(model, where)).length
      },
    }),
  })
