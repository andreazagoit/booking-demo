"use client"

import { useQuery } from "@apollo/client/react"
import { GET_PROPERTY_BOOKINGS } from "@/lib/models/booking/queries"
import { PropertyCalendar } from "./PropertyCalendar"
import type { OwnerPropertyFieldsFragment, GetPropertyBookingsQuery } from "@/gql/graphql"
import { BookingStatus } from "@/gql/graphql"
import Link from "next/link"
import dayjs from "dayjs"

type Property = OwnerPropertyFieldsFragment
type Booking  = GetPropertyBookingsQuery["propertyBookings"][number]

function computeStats(bookings: Booking[]) {
  const confirmed = bookings.filter((b) => b.status === BookingStatus.Confirmed)
  const pending   = bookings.filter((b) => b.status === BookingStatus.Pending)
  const revenue   = confirmed.reduce((sum, b) => sum + b.totalAmount, 0)
  const upcoming  = confirmed.filter((b) => dayjs(b.checkIn).isAfter(dayjs(), "day"))
  return {
    total:     bookings.length,
    confirmed: confirmed.length,
    pending:   pending.length,
    revenue,
    upcoming:  upcoming.length,
  }
}

export function OwnerPropertyCard({ property }: { property: Property }) {
  const { data, loading } = useQuery(GET_PROPERTY_BOOKINGS, {
    variables: { propertyId: property.id },
    fetchPolicy: "cache-and-network",
  })

  const bookings: Booking[] = data?.propertyBookings ?? []
  const stats = computeStats(bookings)

  const STATS = [
    { label: "Prenotazioni", value: stats.total },
    { label: "Confermate",   value: stats.confirmed },
    { label: "In attesa",    value: stats.pending },
    { label: "Ricavi",       value: `€${stats.revenue.toFixed(0)}` },
    { label: "In arrivo",    value: stats.upcoming },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_320px] divide-y md:divide-y-0 md:divide-x divide-border">

        {/* ── COL 1: immagine ── */}
        <div className="relative min-h-[220px] bg-muted overflow-hidden">
          {property.imageUrl ? (
            <img
              src={property.imageUrl}
              alt={property.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-14 h-14">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M4.5 19.5h15a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75h-15a.75.75 0 00-.75.75v12c0 .414.336.75.75.75z" />
              </svg>
            </div>
          )}
          {property.pricePerNight && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-baseline gap-0.5 rounded-lg bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold shadow-sm border border-border/40">
                €{property.pricePerNight}
                <span className="text-[10px] font-normal text-muted-foreground"> / notte</span>
              </span>
            </div>
          )}
        </div>

        {/* ── COL 2: dati + stats ── */}
        <div className="flex flex-col gap-5 p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="font-semibold text-base leading-snug">{property.name}</p>
              {property.location && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 shrink-0 text-muted-foreground/60">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                  </svg>
                  {property.location}
                </p>
              )}
            </div>
            <Link
              href={`/properties/${property.id}`}
              className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              Vedi →
            </Link>
          </div>

          {property.description && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {property.description}
            </p>
          )}

          {/* Stats */}
          <div className="mt-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl bg-muted/40 px-3 py-3 space-y-1">
                <p className="text-lg font-bold tabular-nums leading-none">
                  {loading ? <span className="text-muted-foreground text-sm">…</span> : s.value}
                </p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── COL 3: calendario ── */}
        <div className="flex flex-col gap-3 p-5">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
            Calendario prenotazioni
          </p>
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
              Caricamento...
            </div>
          ) : (
            <PropertyCalendar mode="view" propertyId={property.id} bookings={bookings} />
          )}
        </div>

      </div>
    </div>
  )
}
