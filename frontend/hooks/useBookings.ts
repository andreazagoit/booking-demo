"use client"

import { useQuery } from "@apollo/client/react"
import { GET_BOOKINGS } from "@/lib/models/booking/queries"
import { BookingStatus } from "@/gql/graphql"
import type { GetBookingsQuery } from "@/gql/graphql"

export type { BookingStatus }
export type BookingNode = GetBookingsQuery["bookings"]["edges"][number]["node"]

export interface BookingsFilters {
  from?: string
  to?: string
  status?: BookingStatus
}

export function useBookings(filters: BookingsFilters = {}, pageSize = 50) {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_BOOKINGS, {
    variables: { first: pageSize, ...filters },
    notifyOnNetworkStatusChange: true,
  })

  const loadMore = () => {
    const endCursor = data?.bookings.pageInfo.endCursor
    if (!endCursor) return
    fetchMore({
      variables: { after: endCursor },
      updateQuery(prev, { fetchMoreResult }) {
        if (!fetchMoreResult) return prev
        return {
          bookings: {
            ...fetchMoreResult.bookings,
            edges: [...prev.bookings.edges, ...fetchMoreResult.bookings.edges],
          },
        }
      },
    })
  }

  return {
    bookings: data?.bookings.edges.map((e) => e.node) ?? [],
    pageInfo: data?.bookings.pageInfo,
    totalCount: data?.bookings.totalCount ?? 0,
    loading,
    error,
    loadMore,
    refetch,
    hasNextPage: data?.bookings.pageInfo.hasNextPage ?? false,
  }
}
