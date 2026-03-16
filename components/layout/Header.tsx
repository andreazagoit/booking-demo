"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Container } from "@/components/ui/container"

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "DEMO_APP"

function getInitials(name?: string | null, email?: string) {
  if (name) {
    const parts = name.trim().split(" ")
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }
  return email?.slice(0, 2).toUpperCase() ?? "??"
}

export function Header() {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <Container className="h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="text-sm font-bold tracking-tight">{APP_NAME}</span>
        </Link>

        {/* Auth */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {session ? (
            <button
              onClick={() => router.push("/account")}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-[oklch(0.18_0.02_120)] text-white text-xs font-semibold">
                  {getInitials(session.user.name, session.user.email)}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <Link
              href="/login"
              className="text-xs px-4 py-1.5 rounded-md bg-foreground text-background hover:opacity-85 transition-opacity font-medium"
            >
              Accedi
            </Link>
          )}
        </div>
      </Container>
    </header>
  )
}
