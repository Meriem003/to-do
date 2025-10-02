"use client"

import { useMemo, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/task-list"
import { QuickAddTask } from "@/components/quick-add-task"
import { useTodoStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import type { Priority, TaskStatus } from "@/lib/types"

export default function AllTasksPage() {
  const tasks = useTodoStore((state) => state.tasks)
  const categories = useTodoStore((state) => state.categories)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => !task.archived)
      .filter((task) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            task.title.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query) ||
            task.tags.some((tag) => tag.toLowerCase().includes(query))
          )
        }
        return true
      })
      .filter((task) => (statusFilter === "all" ? true : task.status === statusFilter))
      .filter((task) => (priorityFilter === "all" ? true : task.priority === priorityFilter))
      .filter((task) => (categoryFilter === "all" ? true : task.categoryId === categoryFilter))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter])

  const activeFiltersCount = [statusFilter, priorityFilter, categoryFilter].filter((f) => f !== "all").length

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
            <p className="text-muted-foreground">View and manage all your tasks</p>
          </div>
          <Badge variant="outline" className="text-sm">
            {filteredTasks.length} tasks
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickAddTask />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {activeFiltersCount} active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Filter and search your tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | "all")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | "all")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              Showing {filteredTasks.length} of {tasks.filter((t) => !t.archived).length} tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskList tasks={filteredTasks} emptyMessage="No tasks match your filters" />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
