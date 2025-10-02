"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MoreVertical, Calendar, Tag, CheckCircle2, Clock, Trash2, Copy, Edit } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTodoStore } from "@/lib/store"
import { getPriorityColor, getPriorityBgColor } from "@/lib/utils/task-utils"
import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleTaskComplete, deleteTask, duplicateTask, archiveTask } = useTodoStore()
  const categories = useTodoStore((state) => state.categories)
  const [isHovered, setIsHovered] = useState(false)

  const category = categories.find((c) => c.id === task.categoryId)
  const completedSubTasks = task.subTasks.filter((st) => st.completed).length
  const totalSubTasks = task.subTasks.length

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"

  return (
    <Card
      className={cn(
        "group relative p-4 transition-all hover:shadow-md",
        task.status === "completed" && "opacity-60",
        isOverdue && "border-destructive/50",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.status === "completed"}
          onCheckedChange={() => toggleTaskComplete(task.id)}
          className="mt-1"
        />

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3
                className={cn(
                  "font-medium leading-tight text-balance cursor-pointer hover:text-primary transition-colors",
                  task.status === "completed" && "line-through",
                )}
                onClick={() => onEdit?.(task)}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 shrink-0", !isHovered && "opacity-0 group-hover:opacity-100")}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(task)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => duplicateTask(task.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => archiveTask(task.id)}>
                  <Clock className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", getPriorityBgColor(task.priority))}>
              <span className={getPriorityColor(task.priority)}>{task.priority}</span>
            </Badge>

            {category && (
              <Badge variant="outline" className="text-xs" style={{ borderColor: category.color }}>
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Badge>
            )}

            {task.dueDate && (
              <Badge variant="outline" className={cn("text-xs", isOverdue && "border-destructive text-destructive")}>
                <Calendar className="mr-1 h-3 w-3" />
                {format(new Date(task.dueDate), "MMM d")}
              </Badge>
            )}

            {totalSubTasks > 0 && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {completedSubTasks}/{totalSubTasks}
              </Badge>
            )}

            {task.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {task.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
