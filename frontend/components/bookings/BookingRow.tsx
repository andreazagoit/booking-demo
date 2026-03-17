"use client"

import { useMutation } from "@apollo/client/react"
import { UPDATE_BOOKING_STATUS } from "@/lib/models/booking/queries"
import { BookingStatus } from "@/gql/graphql"
import { BOOKING_STATUS_LABEL, BOOKING_STATUS_CLASS } from "@/lib/constants/booking"
import type { BookingNode } from "@/hooks/useBookings"

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${BOOKING_STATUS_CLASS[status]}`}>
      {BOOKING_STATUS_LABEL[status]}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(amount)
}

interface BookingRowProps {
  booking: BookingNode
  onStatusChange: () => void
}

export function BookingRow({ booking, onStatusChange }: BookingRowProps) {
  const [updateStatus, { loading }] = useMutation(UPDATE_BOOKING_STATUS, {
    onCompleted: onStatusChange,
  })

  return (
    <tr className="border-b border-border hover:bg-muted/40 transition-colors">
      <td className="px-4 py-3 text-sm font-medium">{booking.user?.name ?? "—"}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{booking.user?.email ?? "—"}</td>
      <td className="px-4 py-3 text-sm">{booking.property?.name ?? "—"}</td>
      <td className="px-4 py-3 text-sm">{formatDate(booking.checkIn)}</td>
      <td className="px-4 py-3 text-sm">{formatDate(booking.checkOut)}</td>
      <td className="px-4 py-3 text-sm">{formatCurrency(booking.totalAmount)}</td>
      <td className="px-4 py-3">
        <StatusBadge status={booking.status} />
      </td>
      <td className="px-4 py-3">
        <select
          disabled={loading}
          value={booking.status}
          onChange={(e) =>
            updateStatus({
              variables: { id: booking.id, status: e.target.value as BookingStatus },
            })
          }
          className="text-xs rounded border border-input bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
        >
          <option value={BookingStatus.Confirmed}>{BOOKING_STATUS_LABEL[BookingStatus.Confirmed]}</option>
          <option value={BookingStatus.Pending}>{BOOKING_STATUS_LABEL[BookingStatus.Pending]}</option>
          <option value={BookingStatus.Cancelled}>{BOOKING_STATUS_LABEL[BookingStatus.Cancelled]}</option>
        </select>
      </td>
    </tr>
  )
}
