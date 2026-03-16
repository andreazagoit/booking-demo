import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
  ResourceNotFoundException,
  BillingMode,
} from "@aws-sdk/client-dynamodb"
import { auth } from "@/lib/auth"
import { seedPropertyData, PROPERTIES_TABLE } from "@/lib/models/property/seed"
import { seedBookingData, BOOKINGS_TABLE } from "@/lib/models/booking/seed"

// Demo users: owners have properties, guests make bookings
const DEMO_USERS = [
  { email: "owner1@demo.com", password: "demo1234", name: "Marco Ferretti", role: "owner" as const },
  { email: "owner2@demo.com", password: "demo1234", name: "Elena Conti", role: "owner" as const },
  { email: "guest1@demo.com", password: "demo1234", name: "Luca Romano", role: "guest" as const },
  { email: "guest2@demo.com", password: "demo1234", name: "Sara Mancini", role: "guest" as const },
]

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  const endpoint = process.env.DYNAMODB_ENDPOINT ?? "http://dynamodb:8000"
  const client = new DynamoDBClient({
    endpoint,
    region: "local",
    credentials: { accessKeyId: "local", secretAccessKey: "local" },
  })

  console.log("[instrumentation] Starting database seed...")

  const AUTH_TABLE_PREFIX = process.env.AUTH_TABLE_PREFIX ?? "auth_"
  const AUTH_TABLES = ["user", "session", "account", "verification"].map(
    (t) => `${AUTH_TABLE_PREFIX}${t}`
  )

  // Drop all DynamoDB tables
  for (const table of [BOOKINGS_TABLE, PROPERTIES_TABLE, ...AUTH_TABLES]) {
    try {
      await client.send(new DeleteTableCommand({ TableName: table }))
      console.log(`[instrumentation] Dropped table: ${table}`)
      await new Promise((r) => setTimeout(r, 300))
    } catch (e) {
      if (!(e instanceof ResourceNotFoundException)) throw e
    }
  }

  // Recreate DynamoDB tables
  for (const TableName of [PROPERTIES_TABLE, BOOKINGS_TABLE, ...AUTH_TABLES]) {
    await client.send(
      new CreateTableCommand({
        TableName,
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        BillingMode: BillingMode.PAY_PER_REQUEST,
      })
    )
  }
  console.log("[instrumentation] Tables created")

  // Create demo users via Better Auth (handles password hashing etc.)
  const userIds: Record<string, string> = {}
  for (const user of DEMO_USERS) {
    try {
      const res = await auth.api.signUpEmail({
        body: { email: user.email, password: user.password, name: user.name },
      })
      userIds[user.email] = res.user.id
      console.log(`[instrumentation] Created user: ${user.email} (${res.user.id})`)
    } catch {
      // User may already exist (Better Auth persists across restarts if using adapter)
      console.log(`[instrumentation] User already exists or error: ${user.email}`)
    }
  }

  // Seed properties for owner users
  const ownerIds = DEMO_USERS.filter((u) => u.role === "owner").map((u) => userIds[u.email]).filter(Boolean)
  const properties = await seedPropertyData(ownerIds)

  // Seed bookings: guest users book the properties
  const guestIds = DEMO_USERS.filter((u) => u.role === "guest").map((u) => userIds[u.email]).filter(Boolean)
  await seedBookingData(properties, guestIds)

  console.log("[instrumentation] Seed complete!")
}
