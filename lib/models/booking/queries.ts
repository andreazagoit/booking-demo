import { gql } from "@/gql"

export const GET_PROPERTY_BOOKED_RANGES = gql(`
  query GetPropertyBookedRanges($propertyId: String!) {
    propertyBookedRanges(propertyId: $propertyId) {
      checkIn
      checkOut
    }
  }
`)

// Fragment for owner: property card with all bookings nested
export const OWNER_PROPERTY_FIELDS = gql(`
  fragment OwnerPropertyFields on Property {
    id
    name
    description
    location
    imageUrl
    pricePerNight
    createdAt
  }
`)

export const OWNER_BOOKING_FIELDS = gql(`
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

// Fragment for guest: booking with minimal property info
export const GUEST_BOOKING_FIELDS = gql(`
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

export const GET_MY_PROPERTIES_OWNER = gql(`
  query GetMyPropertiesOwner {
    myProperties {
      ...OwnerPropertyFields
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

export const GET_OWNER_BOOKINGS = gql(`
  query GetOwnerBookings {
    ownerBookings {
      ...OwnerBookingFields
      property {
        id
        name
        location
      }
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
