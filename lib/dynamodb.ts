import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const ENDPOINT = process.env.DYNAMODB_ENDPOINT ?? "http://dynamodb:8000"

const client = new DynamoDBClient({
  endpoint: ENDPOINT,
  region: "local",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "local",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "local",
  },
})

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
})

export const BOOKINGS_TABLE = process.env.BOOKINGS_TABLE ?? "bookings"
export const GUESTS_TABLE = process.env.GUESTS_TABLE ?? "guests"
