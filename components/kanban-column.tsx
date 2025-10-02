"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TaskCard } from "./task-card"
import { QuickAddTask } from "./quick-add-task"
import type { Task, TaskStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  title: string
  status: TaskStatus
  tasks: Task[]
  color: string
}

export function KanbanColumn({ title, status, tasks, color }: KanbanColumnProps) {
  const taskCount = useMemo(() => tasks.length, [tasks])

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <div className={cn("h-2 w-2 rounded-full", color)} />
            {title}
          </span>
          <Badge variant="secondary" className="ml-2">
            {taskCount}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 overflow-y-auto">
        <QuickAddTask />
        {tasks.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-sm text-muted-foreground">No tasks</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
