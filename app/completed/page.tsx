"use client"

/**
 * Page Tâches Terminées
 * Affiche les tâches complétées avec option de suppression en masse
 */

import { useMemo } from "react"react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/task-list"
import { useTodoStore } from "@/lib/store"
import { getTasksByStatus } from "@/lib/utils/task-utils"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CompletedPage() {
  const tasks = useTodoStore((state) => state.tasks)
  const deleteCompletedTasks = useTodoStore((state) => state.deleteCompletedTasks)

  const completedTasks = useMemo(() => getTasksByStatus(tasks, "completed"), [tasks])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Completed Tasks</h1>
            <p className="text-muted-foreground">Tasks you've finished</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {completedTasks.length} tasks
            </Badge>
            {completedTasks.length > 0 && (
              <Button variant="destructive" size="sm" onClick={deleteCompletedTasks}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>All your completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskList tasks={completedTasks} emptyMessage="No completed tasks yet" />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
