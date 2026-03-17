import Link from "next/link"
import Image from "next/image"
import type { GetPropertiesQuery } from "@/gql/graphql"

type Property = GetPropertiesQuery["properties"][number]

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col rounded-2xl bg-card overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/60 hover:border-border"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {property.imageUrl ? (
          <Image
            src={property.imageUrl}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M4.5 19.5h15a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75h-15a.75.75 0 00-.75.75v12c0 .414.336.75.75.75z" />
            </svg>
          </div>
        )}

        {/* Price badge overlay */}
        {property.pricePerNight && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-baseline gap-0.5 rounded-lg bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold shadow-sm border border-border/40">
              €{property.pricePerNight}
              <span className="text-[10px] font-normal text-muted-foreground"> / notte</span>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm leading-snug">
            {property.name}
          </h3>
          {property.location && (
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 shrink-0 text-muted-foreground/60">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
              {property.location}
            </p>
          )}
        </div>

        {property.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-[11px] font-medium text-primary flex items-center gap-0.5 group-hover:gap-1.5 transition-all duration-200">
            Scopri
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.25a.75.75 0 010 1.06l-4.5 4.25a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
