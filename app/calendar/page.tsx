"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { AppLayout } from "@/components/app-layout"
import { CalendarView } from "@/components/calendar-view"
import { TaskDialog } from "@/components/task-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTodoStore } from "@/lib/store"
import type { Task } from "@/lib/types"

export default function CalendarPage() {
  const tasks = useTodoStore((state) => state.tasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const activeTasks = useMemo(() => tasks.filter((t) => !t.archived && t.dueDate), [tasks])

  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return []
    const dateKey = format(selectedDate, "yyyy-MM-dd")
    return activeTasks.filter((task) => {
      if (!task.dueDate) return false
      return format(new Date(task.dueDate), "yyyy-MM-dd") === dateKey
    })
  }, [activeTasks, selectedDate])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View your tasks by date</p>
        </div>

        <CalendarView tasks={activeTasks} onDateClick={setSelectedDate} onTaskClick={setSelectedTask} />

        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle>Tasks for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
              <CardDescription>
                {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? "s" : ""} scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tasks scheduled for this date</p>
              ) : (
                <div className="space-y-2">
                  {selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground capitalize">{task.status}</span>
                        <span className="text-xs capitalize">{task.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedTask && (
          <TaskDialog task={selectedTask} open={!!selectedTask} onOpenChange={() => setSelectedTask(null)} />
        )}
      </div>
    </AppLayout>
  )
}
