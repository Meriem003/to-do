"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTodoStore } from "@/lib/store"

export default function HomePage() {
  const router = useRouter()
  const settings = useTodoStore((state) => state.settings)

  useEffect(() => {
    // Redirect to default view from settings
    router.push(`/${settings.defaultView}`)
  }, [router, settings.defaultView])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    </div>
  )
}
