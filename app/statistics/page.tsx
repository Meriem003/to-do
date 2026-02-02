"use client"

/**
 * Page Statistiques
 * Graphiques et métriques de productivité
 */

import { useMemo } from "react"react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTodoStore } from "@/lib/store"
import { calculateStats, getTasksByPriority } from "@/lib/utils/task-utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Target, Clock, Award } from "lucide-react"

export default function StatisticsPage() {
  const tasks = useTodoStore((state) => state.tasks)
  const categories = useTodoStore((state) => state.categories)

  const stats = useMemo(() => calculateStats(tasks), [tasks])

  const priorityData = useMemo(() => {
    return [
      { name: "Low", value: getTasksByPriority(tasks, "low").length, color: "#3b82f6" },
      { name: "Medium", value: getTasksByPriority(tasks, "medium").length, color: "#eab308" },
      { name: "High", value: getTasksByPriority(tasks, "high").length, color: "#f97316" },
      { name: "Urgent", value: getTasksByPriority(tasks, "urgent").length, color: "#ef4444" },
    ]
  }, [tasks])

  const statusData = useMemo(() => {
    return [
      { name: "To Do", value: tasks.filter((t) => t.status === "todo" && !t.archived).length },
      { name: "In Progress", value: tasks.filter((t) => t.status === "in-progress" && !t.archived).length },
      { name: "Completed", value: tasks.filter((t) => t.status === "completed" && !t.archived).length },
    ]
  }, [tasks])

  const categoryData = useMemo(() => {
    return categories.map((cat) => ({
      name: cat.name,
      value: tasks.filter((t) => t.categoryId === cat.id && !t.archived).length,
      color: cat.color,
    }))
  }, [tasks, categories])

  const completionTrendData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date
    })

    return last7Days.map((date) => {
      const dateStr = date.toISOString().split("T")[0]
      const completed = tasks.filter((t) => {
        if (!t.completedAt) return false
        const completedDate = new Date(t.completedAt).toISOString().split("T")[0]
        return completedDate === dateStr
      }).length

      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        completed,
      }
    })
  }, [tasks])

  const statCards = [
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      description: "Tasks completed",
      icon: Target,
      color: "text-success",
    },
    {
      title: "Productivity Score",
      value: stats.productivityScore,
      description: "Based on recent activity",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Avg. Completion Time",
      value: `${stats.averageCompletionTime}m`,
      description: "Minutes per task",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      title: "This Month",
      value: stats.tasksCompletedThisMonth,
      description: "Tasks completed",
      icon: Award,
      color: "text-warning",
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
          <p className="text-muted-foreground">Insights into your productivity</p>
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
              <CardTitle>Task Status Distribution</CardTitle>
              <CardDescription>Overview of task statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
              <CardDescription>Tasks by priority level</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Trend</CardTitle>
              <CardDescription>Tasks completed over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={completionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line type="monotone" dataKey="completed" stroke="hsl(var(--success))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks by Category</CardTitle>
              <CardDescription>Distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Your productivity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{stats.tasksCompletedToday}</p>
                <p className="text-xs text-muted-foreground">tasks completed</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{stats.tasksCompletedThisWeek}</p>
                <p className="text-xs text-muted-foreground">tasks completed</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{stats.tasksCompletedThisMonth}</p>
                <p className="text-xs text-muted-foreground">tasks completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
