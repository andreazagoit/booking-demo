import { gql } from "@/gql"

export const GET_ME = gql(`
  query GetMe {
    me {
      id
      email
      name
      createdAt
    }
  }
`)
