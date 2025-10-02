"use client"

import { useMemo, useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  tasks: Task[]
  onDateClick?: (date: Date) => void
  onTaskClick?: (task: Task) => void
}

export function CalendarView({ tasks, onDateClick, onTaskClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>()
    tasks.forEach((task) => {
      if (task.dueDate) {
        const dateKey = format(new Date(task.dueDate), "yyyy-MM-dd")
        const existing = map.get(dateKey) || []
        map.set(dateKey, [...existing, task])
      }
    })
    return map
  }, [tasks])

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const today = new Date()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd")
          const dayTasks = tasksByDate.get(dateKey) || []
          const isToday = isSameDay(day, today)
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <Card
              key={day.toISOString()}
              className={cn(
                "min-h-24 p-2 cursor-pointer transition-colors hover:bg-accent",
                !isCurrentMonth && "opacity-40",
                isToday && "border-primary border-2",
              )}
              onClick={() => onDateClick?.(day)}
            >
              <div className="space-y-1">
                <div
                  className={cn(
                    "text-sm font-medium",
                    isToday &&
                      "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "truncate rounded px-1 py-0.5 text-xs cursor-pointer hover:opacity-80",
                        task.status === "completed" ? "bg-success/20 text-success" : "bg-primary/20 text-primary",
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onTaskClick?.(task)
                      }}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{dayTasks.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
