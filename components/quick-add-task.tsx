"use client"

/**
 * Composant d'ajout rapide de tâche
 * Permet d'ajouter une tâche en un clic depuis n'importe quelle vue
 */

import type React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTodoStore } from "@/lib/store"
import type { Priority } from "@/lib/types"

interface QuickAddTaskProps {
  defaultPriority?: Priority
  defaultCategoryId?: string
}

export function QuickAddTask({ defaultPriority = "medium", defaultCategoryId }: QuickAddTaskProps) {
  const [title, setTitle] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const addTask = useTodoStore((state) => state.addTask)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addTask({
      title: title.trim(),
      status: "todo",
      priority: defaultPriority,
      categoryId: defaultCategoryId,
      tags: [],
      subTasks: [],
      archived: false,
    })

    setTitle("")
    setIsExpanded(false)
  }

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start text-muted-foreground hover:text-foreground bg-transparent"
        onClick={() => setIsExpanded(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add task
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        autoFocus
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => {
          if (!title.trim()) setIsExpanded(false)
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setTitle("")
            setIsExpanded(false)
          }
        }}
      />
    </form>
  )
}
