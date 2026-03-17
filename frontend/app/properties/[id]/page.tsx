import { notFound } from "next/navigation"
import Image from "next/image"
import { query } from "@/lib/apollo-client"
import { GET_PROPERTY } from "@/lib/models/property/queries"
import type { GetPropertyQuery } from "@/gql/graphql"
import { BookingForm } from "@/components/properties/BookingForm"
import { Container } from "@/components/ui/container"
import { dbGetPropertyBookedRanges } from "@/lib/models/booking/operations"

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ data }, bookedRanges] = await Promise.all([
    query<GetPropertyQuery>({ query: GET_PROPERTY, variables: { id } }),
    dbGetPropertyBookedRanges(id),
  ])

  if (!data?.property) notFound()

  const property = data.property

  return (
    <div className="bg-background">

      <Container className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-muted">
              {property.imageUrl ? (
                <Image
                  src={property.imageUrl}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  Nessuna immagine
                </div>
              )}
            </div>

            {/* Title & location */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">{property.name}</h1>
              {property.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span>📍</span> {property.location}
                </p>
              )}
            </div>

            {/* Divider */}
            <hr className="border-border" />

            {/* Description */}
            {property.description && (
              <div className="space-y-2">
                <h2 className="text-base font-semibold">Descrizione</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}

            {/* Details chips */}
            <div className="flex flex-wrap gap-2">
              {property.pricePerNight && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium">
                  💰 €{property.pricePerNight} / notte
                </span>
              )}
              {property.location && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium">
                  📍 {property.location}
                </span>
              )}
            </div>
          </div>

          {/* Right: booking form */}
          <div className="lg:col-span-1">
            <BookingForm property={property} initialBookedRanges={bookedRanges} />
          </div>
        </div>
      </Container>
    </div>
  )
}
