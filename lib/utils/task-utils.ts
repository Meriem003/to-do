import type { Task, Priority, Stats } from "../types"
import { isToday, isThisWeek, isThisMonth, startOfDay } from "date-fns"

export function getTasksByStatus(tasks: Task[], status: Task["status"]) {
  return tasks.filter((task) => task.status === status && !task.archived)
}

export function getTasksByPriority(tasks: Task[], priority: Priority) {
  return tasks.filter((task) => task.priority === priority && !task.archived)
}

export function getTodayTasks(tasks: Task[]) {
  return tasks.filter((task) => !task.archived && task.dueDate && isToday(new Date(task.dueDate)))
}

export function getUpcomingTasks(tasks: Task[]) {
  const now = new Date()
  return tasks.filter((task) => !task.archived && task.dueDate && new Date(task.dueDate) > now)
}

export function getOverdueTasks(tasks: Task[]) {
  const now = startOfDay(new Date())
  return tasks.filter(
    (task) => !task.archived && task.status !== "completed" && task.dueDate && new Date(task.dueDate) < now,
  )
}

export function calculateStats(tasks: Task[]): Stats {
  const activeTasks = tasks.filter((task) => !task.archived)
  const completedTasks = activeTasks.filter((task) => task.status === "completed")
  const inProgressTasks = activeTasks.filter((task) => task.status === "in-progress")
  const overdueTasks = getOverdueTasks(activeTasks)

  const completedToday = completedTasks.filter((task) => task.completedAt && isToday(new Date(task.completedAt)))

  const completedThisWeek = completedTasks.filter((task) => task.completedAt && isThisWeek(new Date(task.completedAt)))

  const completedThisMonth = completedTasks.filter(
    (task) => task.completedAt && isThisMonth(new Date(task.completedAt)),
  )

  const completionRate = activeTasks.length > 0 ? (completedTasks.length / activeTasks.length) * 100 : 0

  const tasksWithTime = completedTasks.filter((task) => task.actualTime)
  const averageCompletionTime =
    tasksWithTime.length > 0
      ? tasksWithTime.reduce((sum, task) => sum + (task.actualTime || 0), 0) / tasksWithTime.length
      : 0

  const productivityScore = Math.min(
    100,
    Math.round((completedToday.length * 10 + completedThisWeek.length * 5 + completionRate) / 2),
  )

  return {
    totalTasks: activeTasks.length,
    completedTasks: completedTasks.length,
    inProgressTasks: inProgressTasks.length,
    overdueTasks: overdueTasks.length,
    completionRate: Math.round(completionRate),
    averageCompletionTime: Math.round(averageCompletionTime),
    tasksCompletedToday: completedToday.length,
    tasksCompletedThisWeek: completedThisWeek.length,
    tasksCompletedThisMonth: completedThisMonth.length,
    productivityScore,
  }
}

export function getPriorityColor(priority: Priority): string {
  const colors = {
    low: "text-blue-500",
    medium: "text-yellow-500",
    high: "text-orange-500",
    urgent: "text-red-500",
  }
  return colors[priority]
}

export function getPriorityBgColor(priority: Priority): string {
  const colors = {
    low: "bg-blue-500/10",
    medium: "bg-yellow-500/10",
    high: "bg-orange-500/10",
    urgent: "bg-red-500/10",
  }
  return colors[priority]
}

export function getStatusColor(status: Task["status"]): string {
  const colors = {
    todo: "text-muted-foreground",
    "in-progress": "text-primary",
    completed: "text-success",
  }
  return colors[status]
}
