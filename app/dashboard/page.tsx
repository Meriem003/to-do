"use client"

import { useMemo } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/task-list"
import { QuickAddTask } from "@/components/quick-add-task"
import { useTodoStore } from "@/lib/store"
import { calculateStats, getTodayTasks, getOverdueTasks } from "@/lib/utils/task-utils"
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const tasks = useTodoStore((state) => state.tasks)

  const stats = useMemo(() => calculateStats(tasks), [tasks])
  const todayTasks = useMemo(() => getTodayTasks(tasks), [tasks])
  const overdueTasks = useMemo(() => getOverdueTasks(tasks), [tasks])
  const recentTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.archived)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [tasks],
  )

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: CheckCircle2,
      description: `${stats.completedTasks} completed`,
      color: "text-primary",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: Clock,
      description: "Active tasks",
      color: "text-blue-500",
    },
    {
      title: "Overdue",
      value: stats.overdueTasks,
      icon: AlertCircle,
      description: "Need attention",
      color: "text-destructive",
    },
    {
      title: "Productivity",
      value: `${stats.productivityScore}%`,
      icon: TrendingUp,
      description: "This week",
      color: "text-success",
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your tasks and productivity</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>Tasks due today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuickAddTask />
              <TaskList tasks={todayTasks} emptyMessage="No tasks due today" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overdue Tasks</CardTitle>
              <CardDescription>Tasks that need immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList tasks={overdueTasks} emptyMessage="No overdue tasks" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your most recently updated tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskList tasks={recentTasks} emptyMessage="No recent activity" />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
