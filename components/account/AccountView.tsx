"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { GET_MY_PROPERTIES, CREATE_PROPERTY } from "@/lib/models/property/queries"
import { GET_MY_BOOKINGS } from "@/lib/models/booking/queries"
import type { GetMyPropertiesQuery, GetMyBookingsQuery } from "@/gql/graphql"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { OwnerPropertyCard } from "@/components/properties/OwnerPropertyCard"
import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import dayjs from "dayjs"

type Property = GetMyPropertiesQuery["myProperties"][number]
type GuestBooking = GetMyBookingsQuery["myBookings"][number]

interface AccountViewProps {
  userName: string
  userEmail: string
  initialProperties: Property[]
  initialBookings: GuestBooking[]
}

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confermata",
  PENDING: "In attesa",
  CANCELLED: "Annullata",
}
const STATUS_CLASS: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-red-100 text-red-600",
}

function NewPropertyModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formLocation, setFormLocation] = useState("")
  const [formImageUrl, setFormImageUrl] = useState("")
  const [formPrice, setFormPrice] = useState("")

  const [createProperty, { loading }] = useMutation(CREATE_PROPERTY, {
    onCompleted: () => { onCreated(); onClose() },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) return
    createProperty({
      variables: {
        name: formName.trim(),
        description: formDescription.trim() || null,
        location: formLocation.trim() || null,
        imageUrl: formImageUrl.trim() || null,
        pricePerNight: formPrice ? parseFloat(formPrice) : null,
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Nuova proprietà</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Nome *</label>
            <input
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="es. Villa Toscana"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Descrizione</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Descrivi la tua struttura..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Posizione</label>
              <input
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="es. Chianti, Toscana"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Prezzo / notte (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="es. 150"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">URL immagine</label>
            <input
              type="url"
              value={formImageUrl}
              onChange={(e) => setFormImageUrl(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-foreground text-background px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? "Salvataggio..." : "Crea proprietà"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function AccountView({ userName, userEmail, initialProperties, initialBookings }: AccountViewProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const { data: propData, refetch } = useQuery(GET_MY_PROPERTIES, { fetchPolicy: "cache-and-network" })
  const { data: bookData } = useQuery(GET_MY_BOOKINGS, { fetchPolicy: "cache-and-network" })

  const properties: Property[] = propData?.myProperties ?? initialProperties
  const guestBookings: GuestBooking[] = bookData?.myBookings ?? initialBookings

  return (
    <Container className="py-10 space-y-12">

      {showModal && (
        <NewPropertyModal
          onClose={() => setShowModal(false)}
          onCreated={() => refetch()}
        />
      )}

      {/* ── USER INFO ── */}
      <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold shrink-0">
            {(userName || userEmail).slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <p className="font-semibold">{userName || "Utente"}</p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={() => signOut().then(() => router.push("/"))}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Esci
        </button>
      </div>

      {/* ── LE MIE PROPRIETÀ ── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Le mie proprietà</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Gestisci disponibilità e prenotazioni</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            + Nuova
          </button>
        </div>

        {properties.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">Nessuna proprietà aggiunta.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {properties.map((p) => (
              <OwnerPropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── LE MIE PRENOTAZIONI ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Le mie prenotazioni</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Strutture che hai prenotato</p>
        </div>
        {guestBookings.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/30 px-6 py-8 text-center">
            <p className="text-sm text-muted-foreground">Non hai ancora effettuato prenotazioni.</p>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/" className="underline hover:text-foreground">Esplora le strutture disponibili</Link>
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Proprietà</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Check-in</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Check-out</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Totale</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {guestBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {b.property ? (
                        <Link href={`/properties/${b.property.id}`} className="hover:underline">
                          {b.property.name}
                        </Link>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{dayjs(b.checkIn).format("D MMM YYYY")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{dayjs(b.checkOut).format("D MMM YYYY")}</td>
                    <td className="px-4 py-3 font-medium">€{b.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLASS[b.status] ?? "bg-muted text-muted-foreground"}`}>
                        {STATUS_LABEL[b.status] ?? b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </Container>
  )
}
