/**
 * Store Zustand pour la gestion d'état de l'application Todo
 * Utilise la persistance localStorage pour sauvegarder les données
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task, Category, Settings, FilterOptions } from "./types"

// ============================================
// INTERFACE DU STORE
// ============================================

interface TodoStore {
  // État
  tasks: Task[]
  categories: Category[]
  settings: Settings
  filterOptions: FilterOptions

  // Actions sur les tâches
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  duplicateTask: (id: string) => void
  archiveTask: (id: string) => void

  // Actions sur les sous-tâches
  addSubTask: (taskId: string, title: string) => void
  toggleSubTask: (taskId: string, subTaskId: string) => void
  deleteSubTask: (taskId: string, subTaskId: string) => void

  // Actions sur les catégories
  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void

  // Actions sur les filtres
  setFilterOptions: (options: FilterOptions) => void
  clearFilters: () => void

  // Actions sur les paramètres
  updateSettings: (updates: Partial<Settings>) => void

  // Actions en masse
  deleteCompletedTasks: () => void
  exportData: () => string
  importData: (data: string) => void
}

// ============================================
// VALEURS PAR DÉFAUT
// ============================================

/** Catégories prédéfinies */
const defaultCategories: Category[] = [
  { id: "1", name: "Travail", color: "#3b82f6", icon: "💼" },
  { id: "2", name: "Personnel", color: "#10b981", icon: "🏠" },
  { id: "3", name: "Courses", color: "#f59e0b", icon: "🛒" },
  { id: "4", name: "Santé", color: "#ef4444", icon: "❤️" },
]

/** Paramètres par défaut */
const defaultSettings: Settings = {
  theme: "system",
  notifications: {
    enabled: true,
    dueDateReminder: true,
    dailySummary: true,
  },
  pomodoroSettings: {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  },
  defaultView: "dashboard",
}

// ============================================
// CRÉATION DU STORE
// ============================================

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: defaultCategories,
      settings: defaultSettings,
      filterOptions: {},

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task)),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      toggleTaskComplete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: task.status === "completed" ? "todo" : "completed",
                  completedAt: task.status === "completed" ? undefined : new Date(),
                  updatedAt: new Date(),
                }
              : task,
          ),
        }))
      },

      duplicateTask: (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (task) {
          const duplicated: Task = {
            ...task,
            id: crypto.randomUUID(),
            title: `${task.title} (Copy)`,
            status: "todo",
            completedAt: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          set((state) => ({ tasks: [...state.tasks, duplicated] }))
        }
      },

      archiveTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, archived: true, updatedAt: new Date() } : task,
          ),
        }))
      },

      addSubTask: (taskId, title) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: [
                    ...task.subTasks,
                    {
                      id: crypto.randomUUID(),
                      title,
                      completed: false,
                    },
                  ],
                  updatedAt: new Date(),
                }
              : task,
          ),
        }))
      },

      toggleSubTask: (taskId, subTaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: task.subTasks.map((st) => (st.id === subTaskId ? { ...st, completed: !st.completed } : st)),
                  updatedAt: new Date(),
                }
              : task,
          ),
        }))
      },

      deleteSubTask: (taskId, subTaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: task.subTasks.filter((st) => st.id !== subTaskId),
                  updatedAt: new Date(),
                }
              : task,
          ),
        }))
      },

      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: crypto.randomUUID(),
        }
        set((state) => ({
          categories: [...state.categories, newCategory],
        }))
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)),
        }))
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
          tasks: state.tasks.map((task) => (task.categoryId === id ? { ...task, categoryId: undefined } : task)),
        }))
      },

      setFilterOptions: (options) => {
        set({ filterOptions: options })
      },

      clearFilters: () => {
        set({ filterOptions: {} })
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }))
      },

      deleteCompletedTasks: () => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.status !== "completed"),
        }))
      },

      exportData: () => {
        const state = get()
        return JSON.stringify({
          tasks: state.tasks,
          categories: state.categories,
          settings: state.settings,
        })
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data)
          set({
            tasks: parsed.tasks || [],
            categories: parsed.categories || defaultCategories,
            settings: parsed.settings || defaultSettings,
          })
        } catch (error) {
          console.error("Failed to import data:", error)
        }
      },
    }),
    {
      name: "todo-storage",
    },
  ),
)
