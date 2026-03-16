import { requireAuth, type GraphQLContext } from "@/lib/graphql/context"
import { createBookingSchema } from "@/lib/models/booking/validator"
import {
  dbCreateBooking,
  dbUpdateBookingStatus,
  dbGetPropertyBookedRanges,
  dbGetPropertyBookings,
  dbGetMyBookings,
  dbGetOwnerBookings,
  type BookingStatus,
} from "./operations"

interface UpdateBookingStatusArgs {
  id: string
  status: BookingStatus
}

// Internal booking shape from DynamoDB (has userId/propertyId as raw keys)
interface BookingRecord {
  id: string
  userId: string
  propertyId: string
  checkIn: string
  checkOut: string
  status: BookingStatus
  totalAmount: number
  createdAt: string
}

export const bookingResolvers = {
  Query: {
    propertyBookedRanges: (_: unknown, { propertyId }: { propertyId: string }) => {
      return dbGetPropertyBookedRanges(propertyId)
    },
    propertyBookings: (_: unknown, { propertyId }: { propertyId: string }, context: GraphQLContext) => {
      requireAuth(context)
      return dbGetPropertyBookings(propertyId)
    },
    myBookings: (_: unknown, __: unknown, context: GraphQLContext) => {
      const user = requireAuth(context)
      return dbGetMyBookings(user.id)
    },
    ownerBookings: (_: unknown, __: unknown, context: GraphQLContext) => {
      const user = requireAuth(context)
      return dbGetOwnerBookings(user.id)
    },
  },

  Mutation: {
    createBooking: async (
      _: unknown,
      args: { propertyId: string; checkIn: string; checkOut: string },
      context: GraphQLContext
    ) => {
      const user = requireAuth(context)
      const input = createBookingSchema.parse(args)
      return dbCreateBooking(user.id, input)
    },
    updateBookingStatus: (_: unknown, { id, status }: UpdateBookingStatusArgs, context: GraphQLContext) => {
      requireAuth(context)
      return dbUpdateBookingStatus(id, status)
    },
  },

  // Field resolvers — batched via DataLoader (no N+1)
  Booking: {
    property: (booking: BookingRecord, _: unknown, context: GraphQLContext) => {
      return context.loaders.property.load(booking.propertyId)
    },
    user: (booking: BookingRecord, _: unknown, context: GraphQLContext) => {
      return context.loaders.user.load(booking.userId)
    },
  },
}
