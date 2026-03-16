"use client"

import { useState, useMemo } from "react"
import { Calendar } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { useMutation } from "@apollo/client/react"
import { UPDATE_BOOKING_STATUS, GET_PROPERTY_BOOKINGS } from "@/lib/models/booking/queries"
import type { OwnerBookingFieldsFragment } from "@/gql/graphql"
import { BookingStatus } from "@/gql/graphql"
import dayjs from "dayjs"
import { it } from "date-fns/locale"

type Booking = OwnerBookingFieldsFragment

const COLORS: Record<BookingStatus, { solid: string; badge: string; label: string }> = {
  [BookingStatus.Confirmed]: { solid: "#10b981", badge: "bg-emerald-100 text-emerald-800", label: "Confermata" },
  [BookingStatus.Pending]:   { solid: "#f59e0b", badge: "bg-amber-100 text-amber-800",     label: "In attesa"  },
  [BookingStatus.Cancelled]: { solid: "#ef4444", badge: "bg-red-100 text-red-700",         label: "Annullata"  },
}

interface Props { propertyId: string; bookings: Booking[] }

// ── Modal ──────────────────────────────────────────────────────────────────

function BookingModal({ booking, onClose, onUpdate, loading }: {
  booking: Booking; onClose: () => void
  onUpdate: (s: BookingStatus) => void; loading: boolean
}) {
  const nights = Math.max(1, dayjs(booking.checkOut).diff(dayjs(booking.checkIn), "day"))
  const c = COLORS[booking.status as BookingStatus]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.badge}`}>{c.label}</span>
          <button type="button" onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
              {(booking.user?.name ?? booking.user?.email ?? "?").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{booking.user?.name ?? "Ospite"}</p>
              <p className="text-xs text-muted-foreground">{booking.user?.email ?? ""}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-muted/40 px-3 py-2.5 space-y-0.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Check-in</p>
              <p className="text-sm font-semibold">{dayjs(booking.checkIn).format("D MMM YYYY")}</p>
            </div>
            <div className="rounded-xl bg-muted/40 px-3 py-2.5 space-y-0.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Check-out</p>
              <p className="text-sm font-semibold">{dayjs(booking.checkOut).format("D MMM YYYY")}</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5 text-sm">
            <span className="text-muted-foreground">{nights} {nights === 1 ? "notte" : "notti"}</span>
            <span className="font-bold">€{booking.totalAmount.toFixed(2)}</span>
          </div>
          {booking.status === BookingStatus.Pending && (
            <div className="flex gap-2">
              <button disabled={loading} onClick={() => onUpdate(BookingStatus.Confirmed)}
                className="flex-1 rounded-xl bg-emerald-600 text-white text-sm py-2 font-medium hover:bg-emerald-700 disabled:opacity-50">Approva</button>
              <button disabled={loading} onClick={() => onUpdate(BookingStatus.Cancelled)}
                className="flex-1 rounded-xl border border-red-300 text-red-600 text-sm py-2 font-medium hover:bg-red-50 disabled:opacity-50">Declina</button>
            </div>
          )}
          {booking.status === BookingStatus.Confirmed && (
            <button disabled={loading} onClick={() => onUpdate(BookingStatus.Cancelled)}
              className="w-full rounded-xl border border-red-300 text-red-600 text-sm py-2 font-medium hover:bg-red-50 disabled:opacity-50">
              Annulla prenotazione
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Calendar ───────────────────────────────────────────────────────────────

export function OwnerPropertyCalendar({ propertyId, bookings }: Props) {
  const [selected, setSelected] = useState<Booking | null>(null)

  // date → booking for click detection
  const dateToBooking = useMemo(() => {
    const map = new Map<string, Booking>()
    for (const b of bookings) {
      let d = dayjs(b.checkIn)
      const end = dayjs(b.checkOut)
      while (d.isBefore(end, "day") || d.isSame(end, "day")) {
        map.set(d.format("YYYY-MM-DD"), b)
        d = d.add(1, "day")
      }
    }
    return map
  }, [bookings])

  // Build ranges array — one per booking, with native Date objects
  const ranges = useMemo(() =>
    bookings
      .filter(b => b.status !== BookingStatus.Cancelled)
      .map(b => ({
        startDate: new Date(b.checkIn),
        endDate:   new Date(b.checkOut),
        color:     COLORS[b.status as BookingStatus].solid,
        key:       b.id,
      })),
    [bookings]
  )

  const [updateStatus, { loading }] = useMutation(UPDATE_BOOKING_STATUS, {
    refetchQueries: [{ query: GET_PROPERTY_BOOKINGS, variables: { propertyId } }],
    onCompleted: (data) => {
      if (selected?.id === data.updateBookingStatus.id)
        setSelected({ ...selected, status: data.updateBookingStatus.status as BookingStatus })
    },
  })

  return (
    <div className="space-y-2 owner-cal">
      <style>{`
        .owner-cal .rdrCalendarWrapper { background: transparent; width: 100%; }
        .owner-cal .rdrMonth { width: 100%; padding: 0; }
        .owner-cal .rdrMonthAndYearWrapper { padding: 0; height: 36px; }
        .owner-cal .rdrMonthAndYearPickers select { background: transparent; }
        .owner-cal .rdrDayNumber span { color: var(--foreground, #111); }
        .owner-cal .rdrDayPassive .rdrDayNumber span { color: var(--muted-foreground, #999); opacity: 0.4; }
        .owner-cal .rdrWeekDay { color: var(--muted-foreground, #999); font-size: 11px; }
        .owner-cal .rdrDay { cursor: default; }
        .owner-cal .rdrDayHovered .rdrDayNumber span,
        .owner-cal .rdrDayActive .rdrDayNumber span { color: inherit; }
        .owner-cal .rdrStartEdge, .owner-cal .rdrEndEdge, .owner-cal .rdrInRange { cursor: pointer; }
      `}</style>

      <Calendar
        locale={it}
        ranges={ranges}
        onChange={() => {}}
        showDateDisplay={false}
        showMonthAndYearPickers={false}
        rangeColors={[]}
        dayContentRenderer={(date: Date) => {
          const key = dayjs(date).format("YYYY-MM-DD")
          const booking = dateToBooking.get(key)
          return (
            <span
              onClick={() => booking && setSelected(booking)}
              style={{ cursor: booking ? "pointer" : "default" }}
            >
              {date.getDate()}
            </span>
          )
        }}
      />

      {/* Legend */}
      <div className="flex items-center gap-3 pt-1">
        {[BookingStatus.Confirmed, BookingStatus.Pending].map(s => (
          <span key={s} className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: COLORS[s].solid }} />
            {COLORS[s].label}
          </span>
        ))}
      </div>

      {selected && (
        <BookingModal
          booking={selected}
          loading={loading}
          onClose={() => setSelected(null)}
          onUpdate={(status) => updateStatus({ variables: { id: selected.id, status } })}
        />
      )}
    </div>
  )
}
