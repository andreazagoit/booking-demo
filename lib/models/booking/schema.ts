export const bookingTypeDefs = `#graphql
  enum BookingStatus {
    CONFIRMED
    PENDING
    CANCELLED
  }

  type Booking {
    id: ID!
    checkIn: String!
    checkOut: String!
    status: BookingStatus!
    totalAmount: Float!
    createdAt: String!
    property: Property
    user: User
  }

  type BookedRange {
    checkIn: String!
    checkOut: String!
  }

  type Query {
    myBookings: [Booking!]!
    ownerBookings: [Booking!]!
    propertyBookedRanges(propertyId: String!): [BookedRange!]!
    propertyBookings(propertyId: String!): [Booking!]!
  }

  type Mutation {
    createBooking(
      propertyId: String!
      checkIn: String!
      checkOut: String!
    ): Booking!

    updateBookingStatus(
      id: String!
      status: BookingStatus!
    ): Booking!
  }
`
