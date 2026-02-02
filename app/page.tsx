"use client"

/**
 * Page d'accueil
 * Redirige automatiquement vers la vue par défaut définie dans les paramètres
 */

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTodoStore } from "@/lib/store"

export default function HomePage() {
  const router = useRouter()
  const settings = useTodoStore((state) => state.settings)

  useEffect(() => {
    // Redirection vers la vue par défaut
    router.push(`/${settings.defaultView}`)
  }, [router, settings.defaultView])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Chargement...</h1>
      </div>
    </div>
  )
}
