/**
 * Types et interfaces pour l'application Todo
 * Définit la structure des données utilisées dans toute l'application
 */

/** Niveaux de priorité des tâches */
export type Priority = "low" | "medium" | "high" | "urgent"

/** Statuts possibles d'une tâche */
export type TaskStatus = "todo" | "in-progress" | "completed"

/** Représente une sous-tâche */
export interface SubTask {
  id: string
  title: string
  completed: boolean
}

/** Représente une tâche principale */
export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  categoryId?: string
  tags: string[]
  subTasks: SubTask[]
  estimatedTime?: number   // Temps estimé en minutes
  actualTime?: number      // Temps réel en minutes
  archived: boolean
}

/** Représente une catégorie de tâches */
export interface Category {
  id: string
  name: string
  color: string  // Format hexadécimal (#RRGGBB)
  icon?: string  // Emoji optionnel
}

/** Paramètres de l'application */
export interface Settings {
  theme: "light" | "dark" | "system"
  notifications: {
    enabled: boolean
    dueDateReminder: boolean
    dailySummary: boolean
  }
  pomodoroSettings: {
    workDuration: number     // Durée de travail en minutes
    shortBreak: number       // Pause courte en minutes
    longBreak: number        // Pause longue en minutes
    autoStartBreaks: boolean
    autoStartPomodoros: boolean
  }
  defaultView: "dashboard" | "today" | "upcoming" | "all" | "kanban" | "calendar"
}

/** Statistiques calculées */
export interface Stats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  overdueTasks: number
  completionRate: number
  averageCompletionTime: number
  tasksCompletedToday: number
  tasksCompletedThisWeek: number
  tasksCompletedThisMonth: number
  productivityScore: number
}

/** Options de filtrage des tâches */
export interface FilterOptions {
  status?: TaskStatus[]
  priority?: Priority[]
  categoryId?: string[]
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  searchQuery?: string
}
