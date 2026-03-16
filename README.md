# Booking Demo

Property management platform demo — guest bookings admin dashboard, built as a response to the Ruralis Tech Lead case study (Section 1).

## Project Structure

```
booking-demo/
├── docker-compose.yml
├── frontend/              # Next.js app (React + Tailwind + Apollo + Better Auth)
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts   # Better Auth handler
│   │   │   └── graphql/route.ts         # Apollo Server — POST /api/graphql endpoint
│   │   ├── account/page.tsx             # Owner dashboard + guest bookings view
│   │   ├── properties/[id]/page.tsx     # Property detail + booking form
│   │   └── login/page.tsx               # Login / Registration
│   ├── components/
│   │   ├── account/AccountView.tsx      # Account view with bookings dashboard
│   │   ├── bookings/
│   │   │   ├── BookingsTable.tsx        # Paginated bookings table
│   │   │   ├── BookingsFilters.tsx      # From/to/status filters
│   │   │   └── BookingRow.tsx           # Single row with inline status change
│   │   └── properties/
│   │       ├── OwnerPropertyCard.tsx    # Property card (owner view)
│   │       └── PropertyCalendar.tsx     # Availability calendar + booking form
│   ├── hooks/useBookings.ts             # Apollo useQuery with cursor-based pagination
│   ├── instrumentation.ts               # Auto-seed on boot (drop + recreate + seed)
│   └── lib/
│       ├── auth.ts                      # Better Auth (email+password, DynamoDB adapter)
│       ├── auth-client.ts               # Better Auth React client
│       ├── apollo-client.ts             # Apollo Client (SSR via registerApolloClient)
│       ├── dynamodb.ts                  # DynamoDB DocumentClient singleton
│       ├── graphql/
│       │   ├── schema.ts                # Merged typeDefs from models
│       │   ├── resolvers.ts             # Merged resolvers from models
│       │   ├── context.ts               # GraphQL context (session + DataLoaders)
│       │   └── loaders.ts               # DataLoader for Property and User (N+1 batch)
│       └── models/
│           ├── user/                    # schema, operations, resolvers, queries
│           ├── property/                # schema, operations, resolvers, queries, seed
│           └── booking/                 # schema, operations, resolvers, queries, seed
└── db/
    └── Dockerfile                       # DynamoDB Local (amazon/dynamodb-local)
```

---

## DynamoDB Tables

The project uses **three application tables** plus four tables managed by Better Auth:

| Table | Key | Description |
| --- | --- | --- |
| `bookings` | `id` (hash) | Bookings: `userId`, `propertyId`, `checkIn`, `checkOut`, `status`, `totalAmount` |
| `properties` | `id` (hash) | Properties: `userId`, `name`, `description`, `location`, `imageUrl`, `pricePerNight` |
| `auth_user` | `id` (hash) | Users (name, email, password hash) — managed by Better Auth |
| `auth_session` | `id` (hash) | Active sessions — managed by Better Auth |
| `auth_account` | `id` (hash) | Linked OAuth/credential accounts — managed by Better Auth |
| `auth_verification` | `id` (hash) | Email verification tokens — managed by Better Auth |

> There is no separate `guests` table. Guest data (name, email) is resolved at query time from `auth_user` via DataLoader, using the `userId` field on each booking.

---

## Requirements

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2+

---

## Environment Variables

All environment variables are already configured in `docker-compose.yml` for both profiles (`dev` and `prod`). **No `.env.local` file is needed to run the project with Docker.**

The `frontend/.env.local` file (see `frontend/env.example` as reference) is only needed if you want to run the frontend directly on the host without Docker (`npm run dev`). In that case create `frontend/.env.local`:

```env
BETTER_AUTH_SECRET=demo-secret-key-32-chars-minimum!!
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/api/graphql
DYNAMODB_ENDPOINT=http://localhost:8000
```

> Note: inside Docker the frontend reaches DynamoDB via the internal service name (`http://dynamodb:8000`). Outside Docker it uses the port exposed on the host (`http://localhost:8000`).

---

## Getting Started

### 1. Start the containers

**Development** (hot-reload):
```bash
docker compose --profile dev up --build
```

**Production**:
```bash
docker compose --profile prod up --build
```

| Service    | URL                               |
| ---------- | --------------------------------- |
| Frontend   | http://localhost:3000             |
| GraphQL    | http://localhost:3000/api/graphql |
| DynamoDB   | http://localhost:8000             |

### 2. Automatic seed

The seed runs **automatically on every Next.js startup** via `instrumentation.ts`.

On startup the system:
1. Drops all existing tables
2. Recreates them
3. Inserts mock data: 4 demo users (2 owners + 2 guests), ~6 properties, ~8 bookings per property

**Demo users** (password: `password123`):

| Email | Role | Properties |
| ----- | ---- | ---------- |
| `owner1@test.com` | Owner | Villa Toscana, Masseria Pugliese, … |
| `owner2@test.com` | Owner | Chalet Dolomiti, Casale Umbro, … |
| `guest1@test.com` | Guest | — |
| `guest2@test.com` | Guest | — |

### 3. Sign in

Go to http://localhost:3000 and click _Sign in_ in the header. You can register with any email or use the demo accounts directly.

---

## GraphQL API

The GraphQL playground is available at http://localhost:3000/api/graphql (GET).

### Main queries

```graphql
# Paginated bookings with cursor and filters (owner only)
query GetBookings($first: Int, $after: String, $from: String, $to: String, $status: BookingStatus) {
  bookings(first: $first, after: $after, from: $from, to: $to, status: $status) {
    edges {
      cursor
      node {
        id
        checkIn
        checkOut
        status
        totalAmount
        user { name email }
        property { name location }
      }
    }
    pageInfo { hasNextPage endCursor }
    totalCount
  }
}

# Bookings for the logged-in guest
query GetMyBookings {
  myBookings {
    id checkIn checkOut status totalAmount
    property { id name location }
  }
}

# Properties owned by the logged-in user
query GetMyProperties {
  myProperties { id name description location pricePerNight createdAt }
}
```

### Main mutations

```graphql
mutation CreateBooking($propertyId: String!, $checkIn: String!, $checkOut: String!) {
  createBooking(propertyId: $propertyId, checkIn: $checkIn, checkOut: $checkOut) {
    id status totalAmount
  }
}

mutation UpdateBookingStatus($id: String!, $status: BookingStatus!) {
  updateBookingStatus(id: $id, status: $status) { id status }
}
```

---

## Section 2 — Developer Tooling & Workflow

### 1. IDE

I mainly use **Cursor** as my daily IDE, which is built on top of VS Code. I previously used plain VS Code; the switch to Cursor happened when the integrated AI features started covering a meaningful part of my actual workflow (context-aware completion, multi-file refactoring, explaining legacy code).

### 2. AI tools integrated into the IDE

Yes, I use them actively. I find them most useful in three situations:

- **Exploring unfamiliar codebases** — the agent can map a project's structure and identify the relevant parts much faster than reading files manually one by one
- **Cross-cutting changes** — when a change touches multiple layers (schema, resolvers, generated types, components), the agent keeps everything consistent without having to mentally track every dependency
- **Refactoring and TypeScript errors** — finding all the places that need updating in a typed codebase is one of the use cases where the agent's extended context provides the most value

The main benefit is not speed on a single file, but the fact that the agent holds the context of the entire codebase and propagates changes consistently across layers.

### 3. Using an AI agent for end-to-end debugging on a server or pipeline

I haven't integrated MCP servers or dedicated tools for the agent to interact with cloud infrastructure directly yet (I'm aware they exist and it's clearly the direction the tooling is heading). My approach so far has been different: I design data structures and models so that the shape of the data is readable directly from the code — explicit TypeScript types, GraphQL schema as single source of truth, consistent naming between DB and API. This way the agent can reason about structure and potential issues without needing to access the database or live logs, treating the code itself as a sufficient representation of the system.

---

## Case Study Solution — HTTP 413

### Original problem

The system described in the case study had three related issues:

1. **Full table scan with no pagination** — the backend ran an unbounded `Scan` on the DynamoDB table and returned all results in a single HTTP response. With more than 100 bookings the response exceeded the payload limit (HTTP 413).
2. **Client-side pagination with `Array.slice()`** — the frontend received the entire dataset and simulated pagination locally. If the backend failed, nothing was shown.
3. **Serial enrichment (N+1)** — for each booking a separate query was made to fetch guest metadata from another table.

### Implemented solution

#### Backend — server-side cursor pagination

The GraphQL `bookings` query accepts `first` (page size) and `after` (opaque cursor) and returns a `BookingConnection` type compatible with the Relay spec:

```graphql
type BookingConnection {
  edges: [BookingEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

query bookings(first: Int, after: String, from: String, to: String, status: BookingStatus): BookingConnection!
```

The `dbGetBookingsPaginated` resolver in `operations.ts`:
- Fetches the owner's bookings and applies filters (`from`, `to`, `status`) **server-side**
- Computes `totalCount` on the filtered set without sending all records to the client
- Returns only `first` records at a time (default 50, max 200)
- The cursor is a base64-encoded index into the sorted list — stateless and opaque to the client

```
500 bookings with first=50:
  Page 1 → 50 bookings + endCursor + hasNextPage=true
  Page 2 → 50 bookings + endCursor + hasNextPage=true
  ...
  Last   → N bookings  + endCursor + hasNextPage=false
```

Each response is size-bounded: the payload can no longer exceed HTTP limits regardless of the total data volume.

#### Backend — DataLoader to eliminate N+1

Every `Booking.user` and `Booking.property` field resolver goes through a `DataLoader` (the `dataloader` library). Instead of one `GetItem` per booking, they are batched into a single `BatchGetCommand`:

```
// Before (N+1): 50 bookings = 50 GetItem for user + 50 GetItem for property = 100 DynamoDB requests
// After (DataLoader): 50 bookings = 1 BatchGetCommand for user + 1 BatchGetCommand for property = 2 DynamoDB requests
```

#### Frontend — on-demand infinite scroll

The `useBookings` hook uses Apollo's `fetchMore` with edge merging (infinite scroll pattern). The client never receives more than `pageSize` records per response:

```ts
// Load the first page
useQuery(GET_BOOKINGS, { variables: { first: 50, ...filters } })

// Load the next page on demand
fetchMore({ variables: { after: endCursor } })
// → merges new edges into the Apollo cache
```

Filters (`from`, `to`, `status`) are passed as GraphQL variables — filtering happens on the server, not the client.

#### Additional recommendations for production

This demo uses DynamoDB Local with no GSIs. In production the following should be added:

- **GSI on `bookings.userId`** — to fetch a user's bookings without a full scan
- **GSI on `bookings.propertyId`** — to fetch bookings by property without a full scan
- **GSI on `properties.userId`** — to fetch an owner's properties without a full scan

---

## Useful commands

| Command | Description |
| ------- | ----------- |
| `docker compose --profile dev up --build` | Start everything in development (hot-reload) |
| `docker compose --profile prod up --build` | Start everything in production |
| `docker compose down` | Stop and remove containers |
| `docker compose down -v` | Stop containers and delete volumes |
| `docker compose logs -f frontend-dev` | Follow frontend logs (dev) |
| `docker compose logs -f dynamodb` | Follow DynamoDB logs |
| `aws dynamodb list-tables --endpoint-url http://localhost:8000 --region local` | List DynamoDB tables |
| `aws dynamodb scan --table-name bookings --endpoint-url http://localhost:8000 --region local` | Inspect the bookings table |
