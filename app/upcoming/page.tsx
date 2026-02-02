"use client"

/**
 * Page Tâches À Venir
 * Affiche les tâches futures groupées par jour (7 jours) puis "Plus tard"
 */

import { useMemo } from "react"react"
import { format, addDays, startOfDay, endOfDay } from "date-fns"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/task-list"
import { useTodoStore } from "@/lib/store"
import { getUpcomingTasks } from "@/lib/utils/task-utils"

export default function UpcomingPage() {
  const tasks = useTodoStore((state) => state.tasks)

  const upcomingTasks = useMemo(() => getUpcomingTasks(tasks), [tasks])

  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: typeof upcomingTasks } = {}
    const today = startOfDay(new Date())

    for (let i = 1; i <= 7; i++) {
      const date = addDays(today, i)
      const dateKey = format(date, "yyyy-MM-dd")
      groups[dateKey] = upcomingTasks.filter((task) => {
        if (!task.dueDate) return false
        const taskDate = startOfDay(new Date(task.dueDate))
        return taskDate.getTime() === date.getTime()
      })
    }

    const laterTasks = upcomingTasks.filter((task) => {
      if (!task.dueDate) return false
      const taskDate = startOfDay(new Date(task.dueDate))
      return taskDate.getTime() > endOfDay(addDays(today, 7)).getTime()
    })

    if (laterTasks.length > 0) {
      groups["later"] = laterTasks
    }

    return groups
  }, [upcomingTasks])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upcoming</h1>
          <p className="text-muted-foreground">Tasks scheduled for the next 7 days</p>
        </div>

        {Object.keys(groupedTasks).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No upcoming tasks</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedTasks).map(([dateKey, dateTasks]) => {
              if (dateTasks.length === 0) return null

              const isLater = dateKey === "later"
              const date = isLater ? null : new Date(dateKey)

              return (
                <Card key={dateKey}>
                  <CardHeader>
                    <CardTitle>{isLater ? "Later" : format(date!, "EEEE, MMMM d")}</CardTitle>
                    <CardDescription>
                      {dateTasks.length} task{dateTasks.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TaskList tasks={dateTasks} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
