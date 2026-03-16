export const userTypeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String
    createdAt: String!
  }

  type Query {
    me: User
  }
`
