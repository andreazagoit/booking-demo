import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ApolloWrapper } from "@/components/ApolloWrapper"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <ApolloWrapper>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
