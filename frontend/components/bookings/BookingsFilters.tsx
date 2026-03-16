"use client"

import { BookingStatus } from "@/gql/graphql"

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
          <option value="CONFIRMED">Confermata</option>
          <option value="PENDING">In attesa</option>
          <option value="CANCELLED">Cancellata</option>
        </select>
      </div>
    </div>
  )
}
