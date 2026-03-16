import { auth } from "../auth"
import { createLoaders, type Loaders } from "./loaders"

type SessionUser = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>["user"]

export interface GraphQLContext {
  user: SessionUser | null
  loaders: Loaders
}

export async function buildContext(req: Request): Promise<GraphQLContext> {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    return { user: session?.user ?? null, loaders: createLoaders() }
  } catch {
    return { user: null, loaders: createLoaders() }
  }
}

export function requireAuth(context: GraphQLContext): SessionUser {
  if (!context.user) {
    throw new Error("Unauthorized: please sign in")
  }
  return context.user
}
