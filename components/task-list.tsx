"use client"

import { useState } from "react"
import { TaskCard } from "./task-card"
import { TaskDialog } from "./task-dialog"
import type { Task } from "@/lib/types"

interface TaskListProps {
  tasks: Task[]
  emptyMessage?: string
}

export function TaskList({ tasks, emptyMessage = "No tasks found" }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={setSelectedTask} />
        ))}
      </div>

      {selectedTask && (
        <TaskDialog task={selectedTask} open={!!selectedTask} onOpenChange={() => setSelectedTask(null)} />
      )}
    </>
  )
}
