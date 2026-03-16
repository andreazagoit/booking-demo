import { userResolvers } from "@/lib/models/user/resolvers"
import { propertyResolvers } from "@/lib/models/property/resolvers"
import { bookingResolvers } from "@/lib/models/booking/resolvers"

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...propertyResolvers.Query,
    ...bookingResolvers.Query,  },
  Mutation: {
    ...propertyResolvers.Mutation,
    ...bookingResolvers.Mutation,
  },
  Booking: bookingResolvers.Booking,
}
