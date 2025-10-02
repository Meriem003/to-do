"use client"

import { useMemo } from "react"
import { AppLayout } from "@/components/app-layout"
import { KanbanColumn } from "@/components/kanban-column"
import { useTodoStore } from "@/lib/store"
import { getTasksByStatus } from "@/lib/utils/task-utils"

export default function KanbanPage() {
  const tasks = useTodoStore((state) => state.tasks)

  const todoTasks = useMemo(() => getTasksByStatus(tasks, "todo"), [tasks])
  const inProgressTasks = useMemo(() => getTasksByStatus(tasks, "in-progress"), [tasks])
  const completedTasks = useMemo(() => getTasksByStatus(tasks, "completed"), [tasks])

  const columns = [
    {
      title: "To Do",
      status: "todo" as const,
      tasks: todoTasks,
      color: "bg-muted-foreground",
    },
    {
      title: "In Progress",
      status: "in-progress" as const,
      tasks: inProgressTasks,
      color: "bg-primary",
    },
    {
      title: "Completed",
      status: "completed" as const,
      tasks: completedTasks,
      color: "bg-success",
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-muted-foreground">Visualize your workflow</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => (
            <KanbanColumn key={column.status} {...column} />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
