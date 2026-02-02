import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

/** Métadonnées SEO de l'application */
export const metadata: Metadata = {
  title: "Todo App - Gestion de Tâches",
  description: "Application moderne de gestion de tâches avec tableau de bord, vue Kanban, calendrier et statistiques",
  keywords: ["todo", "tâches", "productivité", "kanban", "gestion de projet"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
