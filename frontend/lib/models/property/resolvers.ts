import { requireAuth, type GraphQLContext } from "@/lib/graphql/context"
import {
  dbCreateProperty,
  dbGetProperty,
  dbGetAllProperties,
  dbGetPropertiesByUser,
  type CreatePropertyInput,
} from "./operations"

export const propertyResolvers = {
  Query: {
    property: (_: unknown, { id }: { id: string }) => dbGetProperty(id),
    properties: () => dbGetAllProperties(),
    myProperties: (_: unknown, __: unknown, context: GraphQLContext) => {
      const user = requireAuth(context)
      return dbGetPropertiesByUser(user.id)
    },
  },
  Mutation: {
    createProperty: (_: unknown, args: CreatePropertyInput, context: GraphQLContext) => {
      const user = requireAuth(context)
      return dbCreateProperty(user.id, args)
    },
  },
}
