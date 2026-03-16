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

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type BookingEdge {
    node: Booking!
    cursor: String!
  }

  type BookingConnection {
    edges: [BookingEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type Query {
    myBookings: [Booking!]!
    ownerBookings: [Booking!]!
    propertyBookedRanges(propertyId: String!): [BookedRange!]!
    propertyBookings(propertyId: String!): [Booking!]!
    bookings(
      first: Int
      after: String
      from: String
      to: String
      status: BookingStatus
    ): BookingConnection!
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
