import { BookingStatus } from "@/gql/graphql"

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  [BookingStatus.Confirmed]: "Confermata",
  [BookingStatus.Pending]:   "In attesa",
  [BookingStatus.Cancelled]: "Cancellata",
}

export const BOOKING_STATUS_CLASS: Record<BookingStatus, string> = {
  [BookingStatus.Confirmed]: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  [BookingStatus.Pending]:   "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  [BookingStatus.Cancelled]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}
