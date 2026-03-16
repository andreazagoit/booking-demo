import { gql } from "@/gql"

export const GET_PROPERTIES = gql(`
  query GetProperties {
    properties {
      id
      name
      description
      location
      imageUrl
      pricePerNight
    }
  }
`)

export const GET_PROPERTY = gql(`
  query GetProperty($id: String!) {
    property(id: $id) {
      id
      name
      description
      location
      imageUrl
      pricePerNight
      userId
      createdAt
    }
  }
`)

export const GET_MY_PROPERTIES = gql(`
  query GetMyProperties {
    myProperties {
      ...OwnerPropertyFields
    }
  }
`)

export const CREATE_PROPERTY = gql(`
  mutation CreateProperty(
    $name: String!
    $description: String
    $location: String
    $imageUrl: String
    $pricePerNight: Float
  ) {
    createProperty(
      name: $name
      description: $description
      location: $location
      imageUrl: $imageUrl
      pricePerNight: $pricePerNight
    ) {
      id
      name
      description
      location
      imageUrl
      pricePerNight
      createdAt
    }
  }
`)
