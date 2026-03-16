"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/lib/auth-client"
import { signInSchema, signUpSchema } from "@/lib/models/user/validator"

const DEMO_USERS = [
  { email: "owner1@demo.com", password: "demo1234", name: "Marco Ferretti", role: "Proprietario" },
  { email: "owner2@demo.com", password: "demo1234", name: "Elena Conti", role: "Proprietario" },
  { email: "guest1@demo.com", password: "demo1234", name: "Luca Romano", role: "Ospite" },
  { email: "guest2@demo.com", password: "demo1234", name: "Sara Mancini", role: "Ospite" },
]

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const schema = mode === "login" ? signInSchema : signUpSchema
    const parsed = schema.safeParse({ email, password, name: mode === "register" ? name : undefined })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setLoading(true)
    try {
      if (mode === "login") {
        const res = await signIn.email({ email, password })
        if (res.error) throw new Error(res.error.message)
      } else {
        const res = await signUp.email({ email, password, name })
        if (res.error) throw new Error(res.error.message)
      }
      router.push("/")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "login" ? "Accedi" : "Crea account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Inserisci le tue credenziali per accedere"
              : "Registrati per gestire le tue proprietà"}
          </p>
        </div>

        {/* Demo users panel */}
        {mode === "login" && (
          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Utenti demo
            </p>
            <div className="space-y-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => { setEmail(u.email); setPassword(u.password) }}
                  className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-left hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="text-xs font-medium">{u.name}</p>
                    <p className="text-[11px] text-muted-foreground">{u.email}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    u.role === "Proprietario"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Password: <span className="font-mono font-medium">demo1234</span> · Clicca per compilare
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mario Rossi"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mario@example.com"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Caricamento..." : mode === "login" ? "Accedi" : "Registrati"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? "Non hai un account?" : "Hai già un account?"}{" "}
          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null) }}
            className="font-medium text-primary hover:underline"
          >
            {mode === "login" ? "Registrati" : "Accedi"}
          </button>
        </p>
      </div>
    </div>
  )
}
