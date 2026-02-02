"use client"

/**
 * Page Aujourd'hui
 * Affiche les tâches du jour organisées par statut
 */

import { useMemo } from "react"react"
import { format } from "date-fns"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/task-list"
import { QuickAddTask } from "@/components/quick-add-task"
import { useTodoStore } from "@/lib/store"
import { getTodayTasks, getOverdueTasks } from "@/lib/utils/task-utils"
import { Calendar, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TodayPage() {
  const tasks = useTodoStore((state) => state.tasks)

  const todayTasks = useMemo(() => getTodayTasks(tasks), [tasks])
  const overdueTasks = useMemo(() => getOverdueTasks(tasks), [tasks])

  const todoTasks = todayTasks.filter((t) => t.status === "todo")
  const inProgressTasks = todayTasks.filter((t) => t.status === "in-progress")
  const completedTasks = todayTasks.filter((t) => t.status === "completed")

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Calendar className="h-8 w-8" />
              Today
            </h1>
            <p className="text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-sm">
              {todayTasks.length} tasks
            </Badge>
            <Badge variant="outline" className="text-sm">
              {completedTasks.length} completed
            </Badge>
          </div>
        </div>

        {overdueTasks.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Overdue Tasks
              </CardTitle>
              <CardDescription>These tasks need your immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList tasks={overdueTasks} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>Quickly add a task for today</CardDescription>
          </CardHeader>
          <CardContent>
            <QuickAddTask />
          </CardContent>
        </Card>

        {inProgressTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>In Progress</CardTitle>
              <CardDescription>{inProgressTasks.length} tasks you're working on</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList tasks={inProgressTasks} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>To Do</CardTitle>
            <CardDescription>{todoTasks.length} tasks to complete today</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskList tasks={todoTasks} emptyMessage="No tasks to do today" />
          </CardContent>
        </Card>

        {completedTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
              <CardDescription>{completedTasks.length} tasks completed today</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList tasks={completedTasks} />
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
