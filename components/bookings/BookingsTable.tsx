"use client"

import type { BookingNode } from "@/hooks/useBookings"
import { BookingRow } from "./BookingRow"

interface BookingsTableProps {
  bookings: BookingNode[]
  loading: boolean
  onRefetch: () => void
}

export function BookingsTable({ bookings, loading, onRefetch }: BookingsTableProps) {
  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        Caricamento prenotazioni...
      </div>
    )
  }

  if (!loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        Nessuna prenotazione trovata nel periodo selezionato.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left">
        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Ospite</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Proprietà</th>
            <th className="px-4 py-3">Check-in</th>
            <th className="px-4 py-3">Check-out</th>
            <th className="px-4 py-3">Importo</th>
            <th className="px-4 py-3">Stato</th>
            <th className="px-4 py-3">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} onStatusChange={onRefetch} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
