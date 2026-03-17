"use client"

import { BookingStatus } from "@/gql/graphql"
import { BOOKING_STATUS_LABEL } from "@/lib/constants/booking"

interface BookingsFiltersProps {
  from: string
  to: string
  status: BookingStatus | ""
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
  onStatusChange: (v: BookingStatus | "") => void
}

export function BookingsFilters({ from, to, status, onFromChange, onToChange, onStatusChange }: BookingsFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Da</label>
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">A</label>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Stato</label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as BookingStatus | "")}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Tutti</option>
          <option value={BookingStatus.Confirmed}>{BOOKING_STATUS_LABEL[BookingStatus.Confirmed]}</option>
          <option value={BookingStatus.Pending}>{BOOKING_STATUS_LABEL[BookingStatus.Pending]}</option>
          <option value={BookingStatus.Cancelled}>{BOOKING_STATUS_LABEL[BookingStatus.Cancelled]}</option>
        </select>
      </div>
    </div>
  )
}
