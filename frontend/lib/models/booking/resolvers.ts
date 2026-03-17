import { requireAuth, type GraphQLContext } from "@/lib/graphql/context"
import { createBookingSchema } from "@/lib/models/booking/validator"
import {
  dbCreateBooking,
  dbUpdateBookingStatus,
  dbGetPropertyBookedRanges,
  dbGetPropertyBookings,
  dbGetMyBookings,
  dbGetOwnerBookings,
  dbGetBookingsPaginated,
  type BookingStatus,
  type BookingItem,
  type BookingsQueryArgs,
} from "./operations"

interface UpdateBookingStatusArgs {
  id: string
  status: BookingStatus
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
    bookings: (_: unknown, args: Omit<BookingsQueryArgs, "ownerId">, context: GraphQLContext) => {
      const user = requireAuth(context)
      return dbGetBookingsPaginated({ ...args, ownerId: user.id })
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
    property: (booking: BookingItem, _: unknown, context: GraphQLContext) => {
      return context.loaders.property.load(booking.propertyId)
    },
    user: (booking: BookingItem, _: unknown, context: GraphQLContext) => {
      return context.loaders.user.load(booking.userId)
    },
  },
}
