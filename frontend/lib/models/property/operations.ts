import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { docClient } from "@/lib/dynamodb"
import { randomId } from "@/lib/utils"

export const PROPERTIES_TABLE = process.env.PROPERTIES_TABLE ?? "properties"

export interface CreatePropertyInput {
  name: string
  description?: string | null
  location?: string | null
  imageUrl?: string | null
  pricePerNight?: number | null
}

export interface PropertyItem {
  id: string
  userId: string
  name: string
  description: string | null
  location: string | null
  imageUrl: string | null
  pricePerNight: number | null
  createdAt: string
}

export async function dbCreateProperty(userId: string, args: CreatePropertyInput): Promise<PropertyItem> {
  const property: PropertyItem = {
    id: randomId(),
    userId,
    name: args.name,
    description: args.description ?? null,
    location: args.location ?? null,
    imageUrl: args.imageUrl ?? null,
    pricePerNight: args.pricePerNight ?? null,
    createdAt: new Date().toISOString(),
  }
  await docClient.send(new PutCommand({ TableName: PROPERTIES_TABLE, Item: property }))
  return property
}

export async function dbGetProperty(id: string): Promise<PropertyItem | null> {
  const result = await docClient.send(
    new GetCommand({ TableName: PROPERTIES_TABLE, Key: { id } })
  )
  return (result.Item as PropertyItem) ?? null
}

export async function dbGetAllProperties(): Promise<PropertyItem[]> {
  const result = await docClient.send(new ScanCommand({ TableName: PROPERTIES_TABLE }))
  return (result.Items ?? []) as PropertyItem[]
}

export async function dbGetPropertiesByUser(userId: string): Promise<PropertyItem[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: PROPERTIES_TABLE,
      FilterExpression: "#uid = :userId",
      ExpressionAttributeNames: { "#uid": "userId" },
      ExpressionAttributeValues: { ":userId": userId },
    })
  )
  return (result.Items ?? []) as PropertyItem[]
}
