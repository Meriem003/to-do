export type Priority = "low" | "medium" | "high" | "urgent"
export type TaskStatus = "todo" | "in-progress" | "completed"

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

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
  estimatedTime?: number // in minutes
  actualTime?: number // in minutes
  archived: boolean
}

export interface Category {
  id: string
  name: string
  color: string
  icon?: string
}

export interface Settings {
  theme: "light" | "dark" | "system"
  notifications: {
    enabled: boolean
    dueDateReminder: boolean
    dailySummary: boolean
  }
  pomodoroSettings: {
    workDuration: number
    shortBreak: number
    longBreak: number
    autoStartBreaks: boolean
    autoStartPomodoros: boolean
  }
  defaultView: "dashboard" | "today" | "upcoming" | "all" | "kanban" | "calendar"
}

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
