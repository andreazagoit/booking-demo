import { dbCreateBooking, BOOKINGS_TABLE } from "./operations"

export { BOOKINGS_TABLE }

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toISO(d: Date): string {
  return d.toISOString().split("T")[0]
}

// Durations in days for each booking slot (2–4 nights max)
const DURATIONS = [2, 3, 4, 2, 3, 2, 4, 3]
// Gap between consecutive bookings (1–2 days)
const GAPS = [2, 1, 2, 1, 2, 1, 2, 1]

export async function seedBookingData(
  properties: Array<{ id: string }>,
  guestUserIds: string[]
) {
  if (guestUserIds.length === 0) {
    console.log("[seed] No guest users available, skipping bookings")
    return
  }

  const now = new Date()
  let count = 0

  for (let propIndex = 0; propIndex < properties.length; propIndex++) {
    const property = properties[propIndex]

    // Stagger start per property so months are varied across properties
    let cursor = addDays(now, propIndex * 3)

    for (let i = 0; i < 8; i++) {
      const globalIndex = propIndex * 8 + i
      const userId = guestUserIds[globalIndex % guestUserIds.length]

      const nights = DURATIONS[i % DURATIONS.length]
      const gap    = GAPS[i % GAPS.length]

      const checkIn  = cursor
      const checkOut = addDays(checkIn, nights)

      await dbCreateBooking(userId, {
        propertyId: property.id,
        checkIn:    toISO(checkIn),
        checkOut:   toISO(checkOut),
      })
      count++

      // Next slot starts after checkOut + gap days
      cursor = addDays(checkOut, gap)
    }
  }

  console.log(`[seed] Inserted ${count} bookings`)
}
