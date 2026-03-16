import type { GraphQLContext } from "@/lib/graphql/context"

export const userResolvers = {
  Query: {
    me: (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) return null
      return {
        id: context.user.id,
        email: context.user.email,
        name: context.user.name,
        createdAt: context.user.createdAt,
      }
    },
  },
}
