/**
 * Utilitaires pour la manipulation des tâches
 * Contient les fonctions de filtrage, calcul de stats et couleurs
 */

import type { Task, Priority, Stats } from "../types"
import { isToday, isThisWeek, isThisMonth, startOfDay } from "date-fns"

// ============================================
// FONCTIONS DE FILTRAGE
// ============================================

/** Filtre les tâches par statut */
export function getTasksByStatus(tasks: Task[], status: Task["status"]): Task[] {
  return tasks.filter((task) => task.status === status && !task.archived)
}

/** Filtre les tâches par priorité */
export function getTasksByPriority(tasks: Task[], priority: Priority): Task[] {
  return tasks.filter((task) => task.priority === priority && !task.archived)
}

/** Récupère les tâches du jour */
export function getTodayTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => !task.archived && task.dueDate && isToday(new Date(task.dueDate)))
}

/** Récupère les tâches à venir */
export function getUpcomingTasks(tasks: Task[]): Task[] {
  const now = new Date()
  return tasks.filter((task) => !task.archived && task.dueDate && new Date(task.dueDate) > now)
}

/** Récupère les tâches en retard */
export function getOverdueTasks(tasks: Task[]): Task[] {
  const now = startOfDay(new Date())
  return tasks.filter(
    (task) => !task.archived && task.status !== "completed" && task.dueDate && new Date(task.dueDate) < now,
  )
}

// ============================================
// CALCUL DES STATISTIQUES
// ============================================

/** Calcule toutes les statistiques des tâches */
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

// ============================================
// COULEURS PAR PRIORITÉ ET STATUT
// ============================================

/** Couleur du texte selon la priorité */
export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: "text-blue-500",
    medium: "text-yellow-500",
    high: "text-orange-500",
    urgent: "text-red-500",
  }
  return colors[priority]
}

/** Couleur de fond selon la priorité */
export function getPriorityBgColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: "bg-blue-500/10",
    medium: "bg-yellow-500/10",
    high: "bg-orange-500/10",
    urgent: "bg-red-500/10",
  }
  return colors[priority]
}

/** Couleur du texte selon le statut */
export function getStatusColor(status: Task["status"]): string {
  const colors: Record<Task["status"], string> = {
    todo: "text-muted-foreground",
    "in-progress": "text-primary",
    completed: "text-success",
  }
  return colors[status]
}
