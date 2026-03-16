"use client"

import { useState, useMemo } from "react"
import { eachDayOfInterval } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { useMutation } from "@apollo/client/react"
import { UPDATE_BOOKING_STATUS, GET_PROPERTY_BOOKINGS } from "@/lib/models/booking/queries"
import type { OwnerBookingFieldsFragment } from "@/gql/graphql"
import { BookingStatus } from "@/gql/graphql"
import dayjs from "dayjs"

// ─────────────────────────────────────────────────────────────────────────────
// Owner mini-calendar with pill ranges
// ─────────────────────────────────────────────────────────────────────────────

const WEEKDAYS = ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"]

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() // 0=Sun
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function isoOf(d: Date) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-")
}

type BookingMeta = {
  booking: OwnerBookingFieldsFragment
  from: string  // inclusive ISO
  to:   string  // inclusive ISO
  status: BookingStatus
}

type PillSegment = {
  booking: OwnerBookingFieldsFragment
  status: BookingStatus
  // position within the week row (0-6)
  startCol: number
  endCol: number
  isRangeStart: boolean
  isRangeEnd: boolean
}

const PILL_COLOR: Record<BookingStatus, { bg: string; text: string }> = {
  [BookingStatus.Confirmed]: { bg: "bg-blue-500",   text: "text-white" },
  [BookingStatus.Pending]:   { bg: "bg-orange-400", text: "text-white" },
  [BookingStatus.Cancelled]: { bg: "bg-zinc-300",   text: "text-zinc-600" },
}

interface MiniCalendarProps {
  bookings: OwnerBookingFieldsFragment[]
  month: Date
  onDayClick: (booking: OwnerBookingFieldsFragment) => void
}

function MiniCalendar({ bookings, month, onDayClick }: MiniCalendarProps) {
  const activeBookings: BookingMeta[] = bookings
    .filter((b) => b.status !== BookingStatus.Cancelled)
    .map((b) => ({ booking: b, from: b.checkIn, to: b.checkOut, status: b.status as BookingStatus }))

  // Build an ISO→booking map for quick lookup
  const dayMap = useMemo(() => {
    const m = new Map<string, BookingMeta>()
    for (const bm of activeBookings) {
      let cur = new Date(bm.from + "T00:00:00")
      const end = new Date(bm.to + "T00:00:00")
      while (cur <= end) {
        m.set(isoOf(cur), bm)
        cur = addDays(cur, 1)
      }
    }
    return m
  }, [activeBookings])

  // Build weeks array for current month (Mon-start)
  const weeks = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
    const lastDay  = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    const weekStart = startOfWeekMonday(firstDay)
    const rows: Date[][] = []
    let cur = weekStart
    while (cur <= lastDay || rows.length === 0) {
      const week: Date[] = []
      for (let i = 0; i < 7; i++) week.push(addDays(cur, i))
      rows.push(week)
      cur = addDays(cur, 7)
      if (cur > lastDay && rows.length >= 4) break
    }
    return rows
  }, [month])

  // For each week, compute pill segments to render
  function pillsForWeek(week: Date[]): PillSegment[] {
    const seen = new Set<string>()
    const segments: PillSegment[] = []

    for (let col = 0; col < 7; col++) {
      const iso = isoOf(week[col])
      const bm = dayMap.get(iso)
      if (!bm || seen.has(bm.booking.id + iso)) continue

      // Find how far this booking extends within the week
      let endCol = col
      for (let c = col + 1; c < 7; c++) {
        const nextIso = isoOf(week[c])
        const nextBm = dayMap.get(nextIso)
        if (nextBm?.booking.id === bm.booking.id) {
          endCol = c
          seen.add(bm.booking.id + nextIso)
        } else {
          break
        }
      }
      seen.add(bm.booking.id + iso)

      segments.push({
        booking: bm.booking,
        status: bm.status,
        startCol: col,
        endCol,
        isRangeStart: isoOf(week[col]) === bm.from,
        isRangeEnd:   isoOf(week[endCol]) === bm.to,
      })
    }
    return segments
  }

  const today = isoOf(new Date())

  return (
    <div className="w-full select-none">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="space-y-0.5">
        {weeks.map((week, wi) => {
          const pills = pillsForWeek(week)
          return (
            <div key={wi} className="relative" style={{ height: 32 }}>
              {/* Day number cells */}
              <div className="grid grid-cols-7 absolute inset-0">
                {week.map((day) => {
                  const iso  = isoOf(day)
                  const bm   = dayMap.get(iso)
                  const isCurrentMonth = day.getMonth() === month.getMonth()
                  const isToday = iso === today
                  const hasPill = !!bm
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => bm && onDayClick(bm.booking)}
                      className={[
                        "relative z-30 flex items-center justify-center text-[12px] h-full w-full rounded-md transition-colors",
                        isCurrentMonth
                          ? hasPill
                            ? "text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                            : "text-foreground"
                          : "opacity-25",
                        isToday ? "font-bold" : "",
                        bm ? "cursor-pointer" : "cursor-default",
                      ].join(" ")}
                    >
                      <span className={isToday ? "underline underline-offset-2" : ""}>{day.getDate()}</span>
                    </button>
                  )
                })}
              </div>

              {/* Pill overlays */}
              {pills.map((seg, si) => {
                const { bg, text } = PILL_COLOR[seg.status]
                const leftPct   = (seg.startCol / 7) * 100
                const widthPct  = ((seg.endCol - seg.startCol + 1) / 7) * 100
                const rLeft  = seg.isRangeStart ? "9999px" : "0"
                const rRight = seg.isRangeEnd   ? "9999px" : "0"
                return (
                  <div
                    key={si}
                    onClick={() => onDayClick(seg.booking)}
                    className={`absolute top-1/2 -translate-y-1/2 h-[18px] ${bg} ${text} cursor-pointer opacity-80 hover:opacity-100 transition-opacity flex items-center px-1.5`}
                    style={{
                      left:  `calc(${leftPct}% + 2px)`,
                      width: `calc(${widthPct}% - 4px)`,
                      borderRadius: `${rLeft} ${rRight} ${rRight} ${rLeft}`,
                      zIndex: 20,
                    }}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Booking = OwnerBookingFieldsFragment

interface BookedRange {
  checkIn: string
  checkOut: string
}

// Guest mode: show blocked dates + allow range selection
interface GuestProps {
  mode: "book"
  bookedRanges: BookedRange[]
  checkIn: string
  checkOut: string
  onCheckInChange: (d: string) => void
  onCheckOutChange: (d: string) => void
}

// Owner mode: show bookings coloured by status + click for modal
interface OwnerProps {
  mode: "view"
  propertyId: string
  bookings: Booking[]
}

type Props = GuestProps | OwnerProps

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function toDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function toISO(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-")
}

function getToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const STATUS_COLOR: Record<BookingStatus, { bg: string; dot: string; label: string }> = {
  [BookingStatus.Confirmed]: { bg: "!bg-blue-100 !text-blue-700 dark:!bg-blue-900/40 dark:!text-blue-300",     dot: "bg-blue-500",  label: "Confermata" },
  [BookingStatus.Pending]:   { bg: "!bg-orange-100 !text-orange-700 dark:!bg-orange-900/40 dark:!text-orange-300", dot: "bg-orange-400", label: "In attesa"  },
  [BookingStatus.Cancelled]: { bg: "!bg-zinc-100 !text-zinc-400 dark:!bg-zinc-800 dark:!text-zinc-500",        dot: "bg-zinc-400",  label: "Annullata"  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Booking detail modal (owner)
// ─────────────────────────────────────────────────────────────────────────────

function BookingModal({ booking, onClose, onUpdate, loading }: {
  booking: Booking
  onClose: () => void
  onUpdate: (s: BookingStatus) => void
  loading: boolean
}) {
  const nights = Math.max(1, dayjs(booking.checkOut).diff(dayjs(booking.checkIn), "day") + 1)
  const c = STATUS_COLOR[booking.status as BookingStatus]
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg}`}>
            {c.label}
          </span>
          <button type="button" onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
              {(booking.user?.name ?? booking.user?.email ?? "?").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{booking.user?.name ?? "Ospite"}</p>
              <p className="text-xs text-muted-foreground">{booking.user?.email ?? ""}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["checkIn", "checkOut"] as const).map((k) => (
              <div key={k} className="rounded-xl bg-muted/40 px-3 py-2.5 space-y-0.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                  {k === "checkIn" ? "Check-in" : "Check-out"}
                </p>
                <p className="text-sm font-semibold">{dayjs(booking[k]).format("D MMM YYYY")}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5 text-sm">
            <span className="text-muted-foreground">{nights} {nights === 1 ? "giorno" : "giorni"}</span>
            <span className="font-bold">€{booking.totalAmount.toFixed(2)}</span>
          </div>
          {booking.status === BookingStatus.Pending && (
            <div className="flex gap-2">
              <button disabled={loading} onClick={() => onUpdate(BookingStatus.Confirmed)}
                className="flex-1 rounded-xl bg-emerald-600 text-white text-sm py-2 font-medium hover:bg-emerald-700 disabled:opacity-50">
                Approva
              </button>
              <button disabled={loading} onClick={() => onUpdate(BookingStatus.Cancelled)}
                className="flex-1 rounded-xl border border-red-300 text-red-600 text-sm py-2 font-medium hover:bg-red-50 disabled:opacity-50">
                Declina
              </button>
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

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function PropertyCalendar(props: Props) {
  const [selected, setSelected] = useState<Booking | null>(null)

  // ── Owner mode data ────────────────────────────────────────────────────────
  const ownerBookings = props.mode === "view" ? props.bookings : []
  const propertyId    = props.mode === "view" ? props.propertyId : ""

  // Default month: first future booking, or today
  const initialMonth = useMemo(() => {
    if (props.mode === "view") {
      const today = getToday()
      const first = [...ownerBookings]
        .filter((b) => b.status !== BookingStatus.Cancelled)
        .map((b) => toDate(b.checkIn))
        .filter((d) => d >= today)
        .sort((a, b) => a.getTime() - b.getTime())[0]
      return first ?? today
    }
    return getToday()
  }, [props.mode, ownerBookings])

  const [viewMonth, setViewMonth] = useState(() => {
    const m = initialMonth
    return new Date(m.getFullYear(), m.getMonth(), 1)
  })

  const [updateStatus, { loading: updating }] = useMutation(UPDATE_BOOKING_STATUS, {
    refetchQueries: [{ query: GET_PROPERTY_BOOKINGS, variables: { propertyId } }],
    onCompleted: (data) => {
      if (selected?.id === data.updateBookingStatus.id)
        setSelected((b) => b ? { ...b, status: data.updateBookingStatus.status as BookingStatus } : null)
    },
  })

  // ── Guest mode data ────────────────────────────────────────────────────────
  const bookedRanges = props.mode === "book" ? props.bookedRanges : []

  const bookedDays = useMemo(() => {
    const days: Date[] = []
    for (const r of bookedRanges) {
      const from = toDate(r.checkIn)
      const to   = toDate(r.checkOut)
      if (from <= to) days.push(...eachDayOfInterval({ start: from, end: to }))
    }
    return days
  }, [bookedRanges])

  const guestSelected: DateRange | undefined =
    props.mode === "book" && props.checkIn
      ? { from: toDate(props.checkIn), to: props.checkOut ? toDate(props.checkOut) : undefined }
      : undefined

  const bookedSet = useMemo(() => {
    const set = new Set<string>()
    for (const d of bookedDays) set.add(toISO(d))
    return set
  }, [bookedDays])

  function rangeContainsBookedDay(from: Date, to: Date): boolean {
    const cur = new Date(from)
    while (cur <= to) {
      if (bookedSet.has(toISO(cur))) return true
      cur.setDate(cur.getDate() + 1)
    }
    return false
  }

  function handleGuestSelect(range: DateRange | undefined) {
    if (props.mode !== "book") return

    if (!range?.from) {
      props.onCheckInChange("")
      props.onCheckOutChange("")
      return
    }

    const from = range.from
    const to   = range.to ?? range.from

    if (rangeContainsBookedDay(from, to)) {
      props.onCheckInChange(toISO(from))
      props.onCheckOutChange("")
      return
    }

    props.onCheckInChange(toISO(from))
    props.onCheckOutChange(toISO(to))
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (props.mode === "book") {
    return (
      <div>
        <Calendar
          mode="range"
          defaultMonth={getToday()}
          selected={guestSelected}
          onSelect={handleGuestSelect}
          disabled={[{ before: getToday() }, ...bookedDays]}
          modifiers={{ booked: bookedDays }}
          modifiersClassNames={{
            booked: "!bg-rose-100 !text-rose-400 line-through opacity-60 dark:!bg-rose-900/30",
          }}
          className="w-full p-0 [--cell-size:--spacing(9)] [--cell-radius:var(--radius-lg)]"
        />
      </div>
    )
  }

  // Owner view — custom MiniCalendar with pill ranges
  const monthLabel = viewMonth.toLocaleString("it-IT", { month: "long", year: "numeric" })
  return (
    <div className="space-y-2">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="text-sm font-medium capitalize">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <MiniCalendar
        bookings={ownerBookings}
        month={viewMonth}
        onDayClick={(booking) => setSelected(booking)}
      />

      {selected && (
        <BookingModal
          booking={selected}
          loading={updating}
          onClose={() => setSelected(null)}
          onUpdate={(status) => updateStatus({ variables: { id: selected.id, status } })}
        />
      )}
    </div>
  )
}
