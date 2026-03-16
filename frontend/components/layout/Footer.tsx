import Link from "next/link"
import { Container } from "@/components/ui/container"

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "DEMO_APP"

export function Footer() {
  return (
    <footer className="border-t border-border bg-[oklch(0.18_0.02_120)] text-white">
      <Container className="pt-14 pb-8">

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="sm:col-span-2 space-y-4 max-w-sm">
            <span className="text-sm font-bold tracking-tight">{APP_NAME}</span>
            <p className="text-sm text-white/60 leading-relaxed">
              Casali, agriturismi e dimore di charme immersi nella natura italiana.
              Prenota la tua esperienza rurale autentica, senza intermediari.
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Esplora</p>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Tutte le strutture" },
                { href: "/login", label: "Accedi" },
                { href: "/login", label: "Registrati" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Manage */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Gestione</p>
            <ul className="space-y-2.5">
              {[
                { href: "/account", label: "Le mie proprietà" },
                { href: "/bookings", label: "Prenotazioni" },
                { href: "/account", label: "Aggiungi struttura" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/30">
          <span>© {new Date().getFullYear()} {APP_NAME}. Piattaforma dimostrativa.</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.7_0.18_131)]" />
            Fatto con passione per la campagna italiana
          </span>
        </div>

      </Container>
    </footer>
  )
}
