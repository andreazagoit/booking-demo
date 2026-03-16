import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { query } from "@/lib/apollo-client"
import { GET_MY_PROPERTIES } from "@/lib/models/property/queries"
import { GET_MY_BOOKINGS } from "@/lib/models/booking/queries"
import type { GetMyPropertiesQuery, GetMyBookingsQuery } from "@/gql/graphql"
import { AccountView } from "@/components/account/AccountView"

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const [propertiesRes, bookingsRes] = await Promise.all([
    query<GetMyPropertiesQuery>({ query: GET_MY_PROPERTIES }),
    query<GetMyBookingsQuery>({ query: GET_MY_BOOKINGS }),
  ])

  return (
    <AccountView
      userName={session.user.name ?? ""}
      userEmail={session.user.email}
      initialProperties={propertiesRes.data?.myProperties ?? []}
      initialBookings={bookingsRes.data?.myBookings ?? []}
    />
  )
}
