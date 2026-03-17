import { gql } from "@/gql"

export const GET_PROPERTY_BOOKED_RANGES = gql(`
  query GetPropertyBookedRanges($propertyId: String!) {
    propertyBookedRanges(propertyId: $propertyId) {
      checkIn
      checkOut
    }
  }
`)

export const GET_BOOKINGS = gql(`
  query GetBookings($first: Int, $after: String, $from: String, $to: String, $status: BookingStatus) {
    bookings(first: $first, after: $after, from: $from, to: $to, status: $status) {
      edges {
        cursor
        node {
          id
          checkIn
          checkOut
          status
          totalAmount
          createdAt
          user {
            id
            name
            email
          }
          property {
            id
            name
            location
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`)

// These fragment declarations are required by graphql-codegen's typed gql() function:
// the queries below reference ...OwnerBookingFields / ...GuestBookingFields and need the
// fragment registered in this file for TypeScript to infer the correct return types.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _OWNER_BOOKING_FIELDS = gql(`
  fragment OwnerBookingFields on Booking {
    id
    checkIn
    checkOut
    status
    totalAmount
    createdAt
    user {
      id
      name
      email
    }
  }
`)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _GUEST_BOOKING_FIELDS = gql(`
  fragment GuestBookingFields on Booking {
    id
    checkIn
    checkOut
    status
    totalAmount
    createdAt
    property {
      id
      name
      location
    }
  }
`)

export const GET_PROPERTY_BOOKINGS = gql(`
  query GetPropertyBookings($propertyId: String!) {
    propertyBookings(propertyId: $propertyId) {
      ...OwnerBookingFields
    }
  }
`)

export const GET_MY_BOOKINGS = gql(`
  query GetMyBookings {
    myBookings {
      ...GuestBookingFields
    }
  }
`)

export const CREATE_BOOKING = gql(`
  mutation CreateBooking(
    $propertyId: String!
    $checkIn: String!
    $checkOut: String!
  ) {
    createBooking(
      propertyId: $propertyId
      checkIn: $checkIn
      checkOut: $checkOut
    ) {
      id
      status
      checkIn
      checkOut
      totalAmount
    }
  }
`)

export const UPDATE_BOOKING_STATUS = gql(`
  mutation UpdateBookingStatus($id: String!, $status: BookingStatus!) {
    updateBookingStatus(id: $id, status: $status) {
      id
      status
    }
  }
`)
