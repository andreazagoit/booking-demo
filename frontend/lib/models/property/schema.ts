export const propertyTypeDefs = `#graphql
  type Property {
    id: ID!
    userId: String!
    name: String!
    description: String
    location: String
    imageUrl: String
    pricePerNight: Float
    createdAt: String!
  }

  type Query {
    properties: [Property!]!
    myProperties: [Property!]!
    property(id: String!): Property
  }

  type Mutation {
    createProperty(
      name: String!
      description: String
      location: String
      imageUrl: String
      pricePerNight: Float
    ): Property!
  }
`
