import { HttpLink } from "@apollo/client"
import { registerApolloClient, ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs"
import { headers } from "next/headers"

export const { getClient, query, PreloadQuery } = registerApolloClient(async () => {
  const headersList = await headers()
  const cookie = headersList.get("cookie") ?? ""

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3000/api/graphql",
      headers: {
        cookie,
      },
    }),
  })
})
