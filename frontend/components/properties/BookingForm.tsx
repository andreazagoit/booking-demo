"use client"

import { useState } from "react"
import dayjs from "dayjs"
import { useMutation, useQuery } from "@apollo/client/react"
import { CREATE_BOOKING, GET_PROPERTY_BOOKED_RANGES } from "@/lib/models/booking/queries"
import type { GetPropertyQuery } from "@/gql/graphql"
import { useSession } from "@/lib/auth-client"
import { PropertyCalendar } from "./PropertyCalendar"
import Link from "next/link"

type Property = NonNullable<GetPropertyQuery["property"]>
type BookedRange = { checkIn: string; checkOut: string }

export function BookingForm({
  property,
  initialBookedRanges,
}: {
  property: Property
  initialBookedRanges: BookedRange[]
}) {
  const { data: session } = useSession()
  const isLoggedIn = !!session

  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [success, setSuccess] = useState(false)
  const [validationError, setValidationError] = useState("")

  // Uses SSR data on first render; refetches from network after a booking is created
  const { data: rangesData } = useQuery(GET_PROPERTY_BOOKED_RANGES, {
    variables: { propertyId: property.id },
    fetchPolicy: "cache-only",
    nextFetchPolicy: "network-only",
  })
  const bookedRanges: BookedRange[] = rangesData?.propertyBookedRanges ?? initialBookedRanges

  // nights = inclusive days: 1 day selected = 1 night
  const nights = checkIn && checkOut
    ? Math.max(1, dayjs(checkOut).diff(dayjs(checkIn), "day") + 1)
    : 0
  const total = nights * (property.pricePerNight ?? 0)
  const [createBooking, { loading, error }] = useMutation(CREATE_BOOKING, {
    onCompleted: () => {
      setSuccess(true)
      setCheckIn("")
      setCheckOut("")
    },
    refetchQueries: [{ query: GET_PROPERTY_BOOKED_RANGES, variables: { propertyId: property.id } }],
    awaitRefetchQueries: true,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError("")
    if (!checkIn || !checkOut) return setValidationError("Seleziona le date dal calendario.")
    if (checkOut < checkIn) return setValidationError("Le date selezionate non sono valide.")

    createBooking({
      variables: {
        propertyId: property.id,
        checkIn,
        checkOut,
      },
    })
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 space-y-3 text-center sticky top-20">
        <div className="text-3xl">🎉</div>
        <p className="font-semibold text-sm">Prenotazione ricevuta!</p>
        <p className="text-xs text-muted-foreground">
          Riceverai una conferma all&apos;indirizzo {session?.user.email}.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-xs text-primary hover:underline"
        >
          Prenota un&apos;altra data
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5 sticky top-20">
      {/* Price header */}
      <div>
        <p className="font-semibold">
          {property.pricePerNight ? (
            <>
              <span className="text-xl">€{property.pricePerNight}</span>
              <span className="text-muted-foreground font-normal text-xs"> / notte</span>
            </>
          ) : (
            <span className="text-sm">Prezzo su richiesta</span>
          )}
        </p>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border border-border bg-muted/40 p-3">
        <PropertyCalendar
          mode="book"
          bookedRanges={bookedRanges}
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
        />
      </div>

      {/* Selected range summary */}
      {(checkIn || checkOut) && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md border border-border px-3 py-2 space-y-0.5">
            <p className="text-muted-foreground font-medium">Check-in</p>
            <p className="font-semibold">{checkIn ? dayjs(checkIn).format("D MMM YYYY") : "—"}</p>
          </div>
          <div className="rounded-md border border-border px-3 py-2 space-y-0.5">
            <p className="text-muted-foreground font-medium">Check-out</p>
            <p className="font-semibold">{checkOut ? dayjs(checkOut).format("D MMM YYYY") : "—"}</p>
          </div>
        </div>
      )}

      {/* Price breakdown */}
      {nights > 0 && property.pricePerNight && (
        <div className="rounded-md bg-muted/60 px-3 py-2 text-xs space-y-1">
          <div className="flex justify-between text-muted-foreground">
            <span>€{property.pricePerNight} × {nights} {nights === 1 ? "giorno" : "giorni"}</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1">
            <span>Totale</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Auth gate or submit */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {(validationError || error) && (
            <p className="text-xs text-destructive">
              {validationError || error?.message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !checkIn || !checkOut}
            className="w-full rounded-md bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? "Invio in corso..." : checkIn && checkOut ? "Richiedi prenotazione" : "Seleziona le date"}
          </button>
        </form>
      ) : (
        <div className="space-y-2">
          <div className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-3 text-center space-y-1.5">
            <p className="text-xs text-muted-foreground">
              Accedi per completare la prenotazione
            </p>
            <Link
              href="/login"
              className="inline-block rounded-md bg-foreground text-background px-5 py-2 text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Accedi
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
