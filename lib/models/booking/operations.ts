import { ScanCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { docClient } from "@/lib/dynamodb"
import { dbGetProperty, PROPERTIES_TABLE } from "@/lib/models/property/operations"
import type { CreateBookingInput } from "@/lib/models/booking/validator"

export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED"

export const BOOKINGS_TABLE = process.env.BOOKINGS_TABLE ?? "bookings"

function randomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// Internal DynamoDB item shape — not exported, use GraphQL types on the client
interface BookingItem {
  id: string
  userId: string
  propertyId: string
  checkIn: string
  checkOut: string
  status: BookingStatus
  totalAmount: number
  createdAt: string
}

export { type CreateBookingInput }

export async function dbCreateBooking(userId: string, input: CreateBookingInput): Promise<BookingItem> {
  // Check for overlapping active bookings (CONFIRMED or PENDING)
  const existing = await docClient.send(
    new ScanCommand({
      TableName: BOOKINGS_TABLE,
      FilterExpression: "#pid = :pid AND #st <> :cancelled",
      ExpressionAttributeNames: { "#pid": "propertyId", "#st": "status" },
      ExpressionAttributeValues: { ":pid": input.propertyId, ":cancelled": "CANCELLED" },
      ProjectionExpression: "checkIn, checkOut",
    })
  )
  const active = (existing.Items ?? []) as { checkIn: string; checkOut: string }[]
  // Two inclusive-day ranges [A,B] and [C,D] overlap when A <= D && C <= B
  const hasOverlap = active.some(
    (r) => input.checkIn <= r.checkOut && r.checkIn <= input.checkOut
  )
  if (hasOverlap) {
    throw new Error("Le date selezionate non sono disponibili. Scegli un periodo diverso.")
  }

  const property = await dbGetProperty(input.propertyId)
  const pricePerNight = property?.pricePerNight ?? 0
  // Inclusive day count: 1 day selected (checkIn === checkOut) = 1 unit
  const nights = Math.max(
    1,
    Math.round(
      (new Date(input.checkOut).getTime() - new Date(input.checkIn).getTime()) / 86400000
    ) + 1
  )
  const totalAmount = pricePerNight * nights

  const booking: BookingItem = {
    id: randomId(),
    userId,
    propertyId: input.propertyId,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    status: "PENDING",
    totalAmount,
    createdAt: new Date().toISOString(),
  }
  await docClient.send(new PutCommand({ TableName: BOOKINGS_TABLE, Item: booking }))
  return booking
}

export async function dbGetMyBookings(userId: string): Promise<BookingItem[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: BOOKINGS_TABLE,
      FilterExpression: "#uid = :userId",
      ExpressionAttributeNames: { "#uid": "userId" },
      ExpressionAttributeValues: { ":userId": userId },
    })
  )
  const bookings = (result.Items ?? []) as BookingItem[]
  return bookings.sort((a, b) => b.checkIn.localeCompare(a.checkIn))
}

export async function dbGetOwnerBookings(ownerId: string): Promise<BookingItem[]> {
  // 1. Get all properties owned by this user
  const propResult = await docClient.send(
    new ScanCommand({
      TableName: PROPERTIES_TABLE,
      FilterExpression: "#uid = :ownerId",
      ExpressionAttributeNames: { "#uid": "userId" },
      ExpressionAttributeValues: { ":ownerId": ownerId },
      ProjectionExpression: "id",
    })
  )
  const propertyIds = (propResult.Items ?? []).map((p) => (p as { id: string }).id)
  if (propertyIds.length === 0) return []

  // 2. Fetch bookings for each property in parallel
  const results = await Promise.all(propertyIds.map((pid) => dbGetPropertyBookings(pid)))
  const all = results.flat()
  return all.sort((a, b) => b.checkIn.localeCompare(a.checkIn))
}

export async function dbGetPropertyBookings(propertyId: string): Promise<BookingItem[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: BOOKINGS_TABLE,
      FilterExpression: "#pid = :pid",
      ExpressionAttributeNames: { "#pid": "propertyId" },
      ExpressionAttributeValues: { ":pid": propertyId },
    })
  )
  const bookings = (result.Items ?? []) as BookingItem[]
  return bookings.sort((a, b) => b.checkIn.localeCompare(a.checkIn))
}

export async function dbGetPropertyBookedRanges(propertyId: string): Promise<{ checkIn: string; checkOut: string }[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: BOOKINGS_TABLE,
      FilterExpression: "#pid = :pid AND #st <> :cancelled",
      ExpressionAttributeNames: { "#pid": "propertyId", "#st": "status" },
      ExpressionAttributeValues: { ":pid": propertyId, ":cancelled": "CANCELLED" },
      ProjectionExpression: "checkIn, checkOut",
    })
  )
  return (result.Items ?? []) as { checkIn: string; checkOut: string }[]
}

export async function dbUpdateBookingStatus(id: string, status: BookingStatus): Promise<BookingItem> {
  const result = await docClient.send(
    new UpdateCommand({
      TableName: BOOKINGS_TABLE,
      Key: { id },
      UpdateExpression: "SET #st = :status",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: { ":status": status },
      ReturnValues: "ALL_NEW",
    })
  )
  return result.Attributes as BookingItem
}
