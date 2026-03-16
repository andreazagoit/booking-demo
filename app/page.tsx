import Link from "next/link"
import { query } from "@/lib/apollo-client"
import { Container } from "@/components/ui/container"
import { GET_PROPERTIES } from "@/lib/models/property/queries"
import type { GetPropertiesQuery } from "@/gql/graphql"
import { PropertyCard } from "@/components/properties/PropertyCard"

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: "Proprietà selezionate",
    description: "Casali, agriturismi e dimore rurali scelte per autenticità, qualità e comfort in mezzo alla natura.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    title: "Prenotazione immediata",
    description: "Scegli le date, compila i dati degli ospiti e invia la richiesta in pochi secondi, senza intermediari.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Gestione sicura",
    description: "Dashboard dedicata per i proprietari: monitora prenotazioni, aggiorna disponibilità e gestisci gli ospiti.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: "Luoghi autentici",
    description: "Dai colli toscani alle campagne umbre, dalle valli alpine alle masserie del Sud. Ogni luogo ha la sua storia.",
  },
]

const STEPS = [
  { number: "01", title: "Sfoglia le strutture", description: "Esplora il catalogo di proprietà rurali e trova quella più adatta alle tue esigenze." },
  { number: "02", title: "Scegli le date", description: "Seleziona il periodo di soggiorno e verifica la disponibilità in tempo reale." },
  { number: "03", title: "Invia la richiesta", description: "Compila i dati del soggiorno e invia la prenotazione direttamente al proprietario." },
  { number: "04", title: "Goditi il soggiorno", description: "Ricevi la conferma e preparati a vivere un'esperienza autentica nella natura." },
]

const TESTIMONIALS = [
  {
    quote: "Abbiamo trascorso una settimana in un casale nel Chianti. Tutto perfetto: la comunicazione con il proprietario, la struttura, i dintorni. Torneremo sicuramente.",
    author: "Marta R.",
    location: "Milano",
  },
  {
    quote: "Finalmente una piattaforma che valorizza le proprietà rurali vere, non i soliti resort. Abbiamo trovato un agriturismo nascosto in Umbria che non dimenticheremo.",
    author: "Luca e Sara",
    location: "Roma",
  },
  {
    quote: "Come proprietario sono molto soddisfatto. La dashboard è semplice, le prenotazioni arrivano direttamente e posso gestire tutto senza intermediari.",
    author: "Giovanni B.",
    location: "Siena",
  },
]

export default async function HomePage() {
  const { data } = await query<GetPropertiesQuery>({ query: GET_PROPERTIES })
  const properties = (data?.properties ?? []).slice(0, 6)

  return (
    <div className="bg-background">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[oklch(0.18_0.02_120)] text-white">
        {/* background texture */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <Container className="relative py-24 sm:py-36 lg:py-44">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.7_0.18_131)]" />
              Proprietà rurali autentiche
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
              La campagna<br />
              <span className="text-[oklch(0.75_0.18_131)]">ti aspetta.</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-xl leading-relaxed">
              Casali, agriturismi e dimore di charme immersi nella natura. Prenota direttamente, senza intermediari.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="#strutture"
                className="inline-flex items-center gap-2 rounded-xl bg-[oklch(0.532_0.157_131.589)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-[oklch(0.532_0.157_131.589)]/30"
              >
                Scopri le strutture
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" /></svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Sono un proprietario
              </Link>
            </div>
          </div>
        </Container>
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
            <path d="M0 64L1440 64L1440 32C1200 64 960 0 720 32C480 64 240 0 0 32L0 64Z" fill="oklch(1 0 0)" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-b border-border">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
            {[
              { value: "200+", label: "Proprietà disponibili" },
              { value: "12", label: "Regioni italiane" },
              { value: "500+", label: "Strutture disponibili" },
              { value: "5.000+", label: "Soggiorni completati" },
            ].map((stat) => (
              <div key={stat.label} className="py-6 px-6 text-center">
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Perché scegliere il rurale
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Uno spazio autentico lontano dal caos. Aria pulita, silenzio e tradizione italiana.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:shadow-sm transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  {f.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── PROPERTIES ── */}
      <section id="strutture" className="py-20 sm:py-28 bg-muted/30 border-y border-border">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Strutture in evidenza</h2>
              <p className="text-muted-foreground">Le più apprezzate del momento</p>
            </div>
            <Link
              href="#strutture"
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              Vedi tutte →
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground text-sm">
              Nessuna struttura disponibile al momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Come funziona</h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Dall'idea alla prenotazione in quattro passaggi semplici.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative space-y-4">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-[calc(50%+28px)] right-0 h-px border-t border-dashed border-border" />
                )}
                <div className="w-10 h-10 rounded-full border-2 border-primary/30 bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 sm:py-28 bg-muted/30 border-y border-border">
        <Container>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Cosa dicono di noi</h2>
            <p className="text-muted-foreground">Ospiti e proprietari che hanno scelto la nostra piattaforma.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[oklch(0.75_0.18_80)]">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="rounded-3xl bg-[oklch(0.18_0.02_120)] text-white px-8 py-16 sm:px-16 sm:py-20 text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
            <div className="relative space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                Hai una proprietà rurale?
              </h2>
              <p className="text-white/70 text-base sm:text-lg">
                Pubblica la tua struttura e raggiungi migliaia di viaggiatori in cerca di esperienze autentiche.
              </p>
            </div>
            <div className="relative flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[oklch(0.532_0.157_131.589)] px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-black/30"
              >
                Inizia gratuitamente
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" /></svg>
              </Link>
              <Link
                href="#strutture"
                className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Esplora prima
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </div>
  )
}
