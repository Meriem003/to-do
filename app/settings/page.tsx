"use client"

/**
 * Page Paramètres
 * Gestion du thème, catégories, notifications et import/export des données
 */

import type React from "react"
import { useState } from "react"react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTodoStore } from "@/lib/store"
import { Download, Upload, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { toast } = useToast()
  const settings = useTodoStore((state) => state.settings)
  const updateSettings = useTodoStore((state) => state.updateSettings)
  const categories = useTodoStore((state) => state.categories)
  const { addCategory, deleteCategory, exportData, importData } = useTodoStore()

  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6")
  const [newCategoryIcon, setNewCategoryIcon] = useState("📁")

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `todo-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Data exported",
      description: "Your data has been exported successfully",
    })
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = event.target?.result as string
        importData(data)
        toast({
          title: "Data imported",
          description: "Your data has been imported successfully",
        })
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import data. Please check the file format.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return
    addCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor,
      icon: newCategoryIcon,
    })
    setNewCategoryName("")
    setNewCategoryColor("#3b82f6")
    setNewCategoryIcon("📁")
    toast({
      title: "Category added",
      description: `${newCategoryName} has been added`,
    })
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and data</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={settings.theme} onValueChange={(value: any) => updateSettings({ theme: value })}>
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultView">Default View</Label>
              <Select
                value={settings.defaultView}
                onValueChange={(value: any) => updateSettings({ defaultView: value })}
              >
                <SelectTrigger id="defaultView">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="kanban">Kanban</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for tasks</p>
              </div>
              <Switch
                checked={settings.notifications.enabled}
                onCheckedChange={(checked) =>
                  updateSettings({
                    notifications: { ...settings.notifications, enabled: checked },
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Due Date Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming due dates</p>
              </div>
              <Switch
                checked={settings.notifications.dueDateReminder}
                onCheckedChange={(checked) =>
                  updateSettings({
                    notifications: { ...settings.notifications, dueDateReminder: checked },
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Summary</Label>
                <p className="text-sm text-muted-foreground">Receive a daily summary of your tasks</p>
              </div>
              <Switch
                checked={settings.notifications.dailySummary}
                onCheckedChange={(checked) =>
                  updateSettings({
                    notifications: { ...settings.notifications, dailySummary: checked },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pomodoro Timer</CardTitle>
            <CardDescription>Configure Pomodoro timer settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="workDuration">Work Duration (minutes)</Label>
                <Input
                  id="workDuration"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.pomodoroSettings.workDuration}
                  onChange={(e) =>
                    updateSettings({
                      pomodoroSettings: {
                        ...settings.pomodoroSettings,
                        workDuration: Number.parseInt(e.target.value) || 25,
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortBreak">Short Break (minutes)</Label>
                <Input
                  id="shortBreak"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.pomodoroSettings.shortBreak}
                  onChange={(e) =>
                    updateSettings({
                      pomodoroSettings: {
                        ...settings.pomodoroSettings,
                        shortBreak: Number.parseInt(e.target.value) || 5,
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longBreak">Long Break (minutes)</Label>
                <Input
                  id="longBreak"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.pomodoroSettings.longBreak}
                  onChange={(e) =>
                    updateSettings({
                      pomodoroSettings: {
                        ...settings.pomodoroSettings,
                        longBreak: Number.parseInt(e.target.value) || 15,
                      },
                    })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-start Breaks</Label>
                <p className="text-sm text-muted-foreground">Automatically start break timers</p>
              </div>
              <Switch
                checked={settings.pomodoroSettings.autoStartBreaks}
                onCheckedChange={(checked) =>
                  updateSettings({
                    pomodoroSettings: { ...settings.pomodoroSettings, autoStartBreaks: checked },
                  })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-start Pomodoros</Label>
                <p className="text-sm text-muted-foreground">Automatically start work timers</p>
              </div>
              <Switch
                checked={settings.pomodoroSettings.autoStartPomodoros}
                onCheckedChange={(checked) =>
                  updateSettings({
                    pomodoroSettings: { ...settings.pomodoroSettings, autoStartPomodoros: checked },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage your task categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="text-xs text-muted-foreground">{category.color}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm(`Delete category "${category.name}"?`)) {
                        deleteCategory(category.id)
                        toast({
                          title: "Category deleted",
                          description: `${category.name} has been deleted`,
                        })
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Add New Category</Label>
              <div className="grid gap-3 md:grid-cols-4">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Icon (emoji)"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  maxLength={2}
                />
                <Input type="color" value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} />
                <Button onClick={handleAddCategory} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or import your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleExport} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" asChild>
                <label htmlFor="import-file" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                  <input id="import-file" type="file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Export your data as JSON to back it up or transfer to another device. Import previously exported data to
              restore your tasks and settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
