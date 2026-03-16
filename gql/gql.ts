/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetPropertyBookedRanges($propertyId: String!) {\n    propertyBookedRanges(propertyId: $propertyId) {\n      checkIn\n      checkOut\n    }\n  }\n": typeof types.GetPropertyBookedRangesDocument,
    "\n  fragment OwnerPropertyFields on Property {\n    id\n    name\n    description\n    location\n    imageUrl\n    pricePerNight\n    createdAt\n  }\n": typeof types.OwnerPropertyFieldsFragmentDoc,
    "\n  fragment OwnerBookingFields on Booking {\n    id\n    checkIn\n    checkOut\n    status\n    totalAmount\n    createdAt\n    user {\n      id\n      name\n      email\n    }\n  }\n": typeof types.OwnerBookingFieldsFragmentDoc,
    "\n  fragment GuestBookingFields on Booking {\n    id\n    checkIn\n    checkOut\n    status\n    totalAmount\n    createdAt\n    property {\n      id\n      name\n      location\n    }\n  }\n": typeof types.GuestBookingFieldsFragmentDoc,
    "\n  query GetMyPropertiesOwner {\n    myProperties {\n      ...OwnerPropertyFields\n    }\n  }\n": typeof types.GetMyPropertiesOwnerDocument,
    "\n  query GetPropertyBookings($propertyId: String!) {\n    propertyBookings(propertyId: $propertyId) {\n      ...OwnerBookingFields\n    }\n  }\n": typeof types.GetPropertyBookingsDocument,
    "\n  query GetMyBookings {\n    myBookings {\n      ...GuestBookingFields\n    }\n  }\n": typeof types.GetMyBookingsDocument,
    "\n  query GetOwnerBookings {\n    ownerBookings {\n      ...OwnerBookingFields\n      property {\n        id\n        name\n        location\n      }\n    }\n  }\n": typeof types.GetOwnerBookingsDocument,
    "\n  mutation CreateBooking(\n    $propertyId: String!\n    $checkIn: String!\n    $checkOut: String!\n  ) {\n    createBooking(\n      propertyId: $propertyId\n      checkIn: $checkIn\n      checkOut: $checkOut\n    ) {\n      id\n      status\n      checkIn\n      checkOut\n      totalAmount\n    }\n  }\n": typeof types.CreateBookingDocument,
    "\n  mutation UpdateBookingStatus($id: String!, $status: BookingStatus!) {\n    updateBookingStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n": typeof types.UpdateBookingStatusDocument,
    "\n  query GetProperties {\n    properties {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n    }\n  }\n": typeof types.GetPropertiesDocument,
    "\n  query GetProperty($id: String!) {\n    property(id: $id) {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n      userId\n      createdAt\n    }\n  }\n": typeof types.GetPropertyDocument,
    "\n  query GetMyProperties {\n    myProperties {\n      ...OwnerPropertyFields\n    }\n  }\n": typeof types.GetMyPropertiesDocument,
    "\n  mutation CreateProperty(\n    $name: String!\n    $description: String\n    $location: String\n    $imageUrl: String\n    $pricePerNight: Float\n  ) {\n    createProperty(\n      name: $name\n      description: $description\n      location: $location\n      imageUrl: $imageUrl\n      pricePerNight: $pricePerNight\n    ) {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n      createdAt\n    }\n  }\n": typeof types.CreatePropertyDocument,
    "\n  query GetMe {\n    me {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n": typeof types.GetMeDocument,
    "\n  query GetBookings($first: Int, $after: String, $from: String, $to: String, $status: BookingStatus) {\n    bookings(first: $first, after: $after, from: $from, to: $to, status: $status) {\n      edges {\n        cursor\n        node {\n          id\n          checkIn\n          checkOut\n          status\n          totalAmount\n          createdAt\n          user {\n            id\n            name\n            email\n          }\n          property {\n            id\n            name\n            location\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      totalCount\n    }\n  }\n": typeof types.GetBookingsDocument,
};
const documents: Documents = {
    "\n  query GetPropertyBookedRanges($propertyId: String!) {\n    propertyBookedRanges(propertyId: $propertyId) {\n      checkIn\n      checkOut\n    }\n  }\n": types.GetPropertyBookedRangesDocument,
    "\n  fragment OwnerPropertyFields on Property {\n    id\n    name\n    description\n    location\n    imageUrl\n    pricePerNight\n    createdAt\n  }\n": types.OwnerPropertyFieldsFragmentDoc,
    "\n  fragment OwnerBookingFields on Booking {\n    id\n    checkIn\n    checkOut\n    status\n    totalAmount\n    createdAt\n    user {\n      id\n      name\n      email\n    }\n  }\n": types.OwnerBookingFieldsFragmentDoc,
    "\n  fragment GuestBookingFields on Booking {\n    id\n    checkIn\n    checkOut\n    status\n    totalAmount\n    createdAt\n    property {\n      id\n      name\n      location\n    }\n  }\n": types.GuestBookingFieldsFragmentDoc,
    "\n  query GetMyPropertiesOwner {\n    myProperties {\n      ...OwnerPropertyFields\n    }\n  }\n": types.GetMyPropertiesOwnerDocument,
    "\n  query GetPropertyBookings($propertyId: String!) {\n    propertyBookings(propertyId: $propertyId) {\n      ...OwnerBookingFields\n    }\n  }\n": types.GetPropertyBookingsDocument,
    "\n  query GetMyBookings {\n    myBookings {\n      ...GuestBookingFields\n    }\n  }\n": types.GetMyBookingsDocument,
    "\n  query GetOwnerBookings {\n    ownerBookings {\n      ...OwnerBookingFields\n      property {\n        id\n        name\n        location\n      }\n    }\n  }\n": types.GetOwnerBookingsDocument,
    "\n  mutation CreateBooking(\n    $propertyId: String!\n    $checkIn: String!\n    $checkOut: String!\n  ) {\n    createBooking(\n      propertyId: $propertyId\n      checkIn: $checkIn\n      checkOut: $checkOut\n    ) {\n      id\n      status\n      checkIn\n      checkOut\n      totalAmount\n    }\n  }\n": types.CreateBookingDocument,
    "\n  mutation UpdateBookingStatus($id: String!, $status: BookingStatus!) {\n    updateBookingStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n": types.UpdateBookingStatusDocument,
    "\n  query GetProperties {\n    properties {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n    }\n  }\n": types.GetPropertiesDocument,
    "\n  query GetProperty($id: String!) {\n    property(id: $id) {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n      userId\n      createdAt\n    }\n  }\n": types.GetPropertyDocument,
    "\n  query GetMyProperties {\n    myProperties {\n      ...OwnerPropertyFields\n    }\n  }\n": types.GetMyPropertiesDocument,
    "\n  mutation CreateProperty(\n    $name: String!\n    $description: String\n    $location: String\n    $imageUrl: String\n    $pricePerNight: Float\n  ) {\n    createProperty(\n      name: $name\n      description: $description\n      location: $location\n      imageUrl: $imageUrl\n      pricePerNight: $pricePerNight\n    ) {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n      createdAt\n    }\n  }\n": types.CreatePropertyDocument,
    "\n  query GetMe {\n    me {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n": types.GetMeDocument,
    "\n  query GetBookings($first: Int, $after: String, $from: String, $to: String, $status: BookingStatus) {\n    bookings(first: $first, after: $after, from: $from, to: $to, status: $status) {\n      edges {\n        cursor\n        node {\n          id\n          checkIn\n          checkOut\n          status\n          totalAmount\n          createdAt\n          user {\n            id\n            name\n            email\n          }\n          property {\n            id\n            name\n            location\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      totalCount\n    }\n  }\n": types.GetBookingsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPropertyBookedRanges($propertyId: String!) {\n    propertyBookedRanges(propertyId: $propertyId) {\n      checkIn\n      checkOut\n    }\n  }\n"): (typeof documents)["\n  query GetPropertyBookedRanges($propertyId: String!) {\n    propertyBookedRanges(propertyId: $propertyId) {\n      checkIn\n      checkOut\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment OwnerPropertyFields on Property {\n    id\n    name\n    description\n    location\n    imageUrl\n    pricePerNight\n    createdAt\n  }\n"): (typeof documents)["\n  fragment OwnerPropertyFields on Property {\n    id\n    name\n    description\n    location\n    imageUrl\n    pricePerNight\n    createdAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment OwnerBookingFields on Booking {\n    id\n    checkIn\n    checkOut\n    status\n    totalAmount\n    createdAt\n    user {\n      id\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  fragment OwnerBookingFields on Booking {\n    id\n    checkIn\n    checkOut\n    status\n    totalAmount\n    createdAt\n    user {\n      id\n      name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment GuestBookingFields on Booking {\n    id\n    checkIn\n    checkOut\n    status\n    totalAmount\n    createdAt\n    property {\n      id\n      name\n      location\n    }\n  }\n"): (typeof documents)["\n  fragment GuestBookingFields on Booking {\n    id\n    checkIn\n    checkOut\n    status\n    totalAmount\n    createdAt\n    property {\n      id\n      name\n      location\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyPropertiesOwner {\n    myProperties {\n      ...OwnerPropertyFields\n    }\n  }\n"): (typeof documents)["\n  query GetMyPropertiesOwner {\n    myProperties {\n      ...OwnerPropertyFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPropertyBookings($propertyId: String!) {\n    propertyBookings(propertyId: $propertyId) {\n      ...OwnerBookingFields\n    }\n  }\n"): (typeof documents)["\n  query GetPropertyBookings($propertyId: String!) {\n    propertyBookings(propertyId: $propertyId) {\n      ...OwnerBookingFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyBookings {\n    myBookings {\n      ...GuestBookingFields\n    }\n  }\n"): (typeof documents)["\n  query GetMyBookings {\n    myBookings {\n      ...GuestBookingFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetOwnerBookings {\n    ownerBookings {\n      ...OwnerBookingFields\n      property {\n        id\n        name\n        location\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetOwnerBookings {\n    ownerBookings {\n      ...OwnerBookingFields\n      property {\n        id\n        name\n        location\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateBooking(\n    $propertyId: String!\n    $checkIn: String!\n    $checkOut: String!\n  ) {\n    createBooking(\n      propertyId: $propertyId\n      checkIn: $checkIn\n      checkOut: $checkOut\n    ) {\n      id\n      status\n      checkIn\n      checkOut\n      totalAmount\n    }\n  }\n"): (typeof documents)["\n  mutation CreateBooking(\n    $propertyId: String!\n    $checkIn: String!\n    $checkOut: String!\n  ) {\n    createBooking(\n      propertyId: $propertyId\n      checkIn: $checkIn\n      checkOut: $checkOut\n    ) {\n      id\n      status\n      checkIn\n      checkOut\n      totalAmount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateBookingStatus($id: String!, $status: BookingStatus!) {\n    updateBookingStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateBookingStatus($id: String!, $status: BookingStatus!) {\n    updateBookingStatus(id: $id, status: $status) {\n      id\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProperties {\n    properties {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n    }\n  }\n"): (typeof documents)["\n  query GetProperties {\n    properties {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProperty($id: String!) {\n    property(id: $id) {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n      userId\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetProperty($id: String!) {\n    property(id: $id) {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n      userId\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyProperties {\n    myProperties {\n      ...OwnerPropertyFields\n    }\n  }\n"): (typeof documents)["\n  query GetMyProperties {\n    myProperties {\n      ...OwnerPropertyFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateProperty(\n    $name: String!\n    $description: String\n    $location: String\n    $imageUrl: String\n    $pricePerNight: Float\n  ) {\n    createProperty(\n      name: $name\n      description: $description\n      location: $location\n      imageUrl: $imageUrl\n      pricePerNight: $pricePerNight\n    ) {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProperty(\n    $name: String!\n    $description: String\n    $location: String\n    $imageUrl: String\n    $pricePerNight: Float\n  ) {\n    createProperty(\n      name: $name\n      description: $description\n      location: $location\n      imageUrl: $imageUrl\n      pricePerNight: $pricePerNight\n    ) {\n      id\n      name\n      description\n      location\n      imageUrl\n      pricePerNight\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMe {\n    me {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      id\n      email\n      name\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetBookings($first: Int, $after: String, $from: String, $to: String, $status: BookingStatus) {\n    bookings(first: $first, after: $after, from: $from, to: $to, status: $status) {\n      edges {\n        cursor\n        node {\n          id\n          checkIn\n          checkOut\n          status\n          totalAmount\n          createdAt\n          user {\n            id\n            name\n            email\n          }\n          property {\n            id\n            name\n            location\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      totalCount\n    }\n  }\n"): (typeof documents)["\n  query GetBookings($first: Int, $after: String, $from: String, $to: String, $status: BookingStatus) {\n    bookings(first: $first, after: $after, from: $from, to: $to, status: $status) {\n      edges {\n        cursor\n        node {\n          id\n          checkIn\n          checkOut\n          status\n          totalAmount\n          createdAt\n          user {\n            id\n            name\n            email\n          }\n          property {\n            id\n            name\n            location\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      totalCount\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;