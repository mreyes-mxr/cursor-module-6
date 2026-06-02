import { useState, useCallback } from 'react'
import type { Task, TaskStatus } from '../../types/task'
import { KanbanColumn } from './KanbanColumn'

// ── Types ────────────────────────────────────────────────────────────────────

const COLUMN_ORDER: TaskStatus[] = ['todo', 'in-progress', 'done']

interface KanbanBoardProps {
  initialTasks: Task[]
}

// ── Component ────────────────────────────────────────────────────────────────

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)

  // Group tasks by status
  const columns = COLUMN_ORDER.reduce<Record<TaskStatus, Task[]>>(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status)
      return acc
    },
    { todo: [], 'in-progress': [], done: [] },
  )

  const handleDragStart = useCallback((taskId: string) => {
    setDraggingId(taskId)
  }, [])

  const handleDragOver = useCallback(
    (_e: React.DragEvent, status: TaskStatus) => {
      setDragOverColumn(status)
    },
    [],
  )

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null)
  }, [])

  /**
   * Placeholder drop handler — moves the dragged task to the target column.
   * Replace with a full DnD library (e.g. @dnd-kit/core) for production use.
   */
  const handleDrop = useCallback(
    (_e: React.DragEvent, targetStatus: TaskStatus) => {
      if (!draggingId) return
      setTasks((prev) =>
        prev.map((t) =>
          t.id === draggingId ? { ...t, status: targetStatus } : t,
        ),
      )
      setDraggingId(null)
      setDragOverColumn(null)
    },
    [draggingId],
  )

  const totalDone = columns.done.length
  const totalTasks = tasks.length
  const pct = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-gray-500 tabular-nums w-16 text-right">
          {totalDone}/{totalTasks} done
        </span>
      </div>

      {/* Columns */}
      <div className="flex gap-4 items-start overflow-x-auto pb-4">
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columns[status]}
            isDragOver={dragOverColumn === status}
            onDragStart={handleDragStart}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* DnD note */}
      <p className="text-center text-[11px] text-gray-400">
        Drag cards between columns to update their status · Drag-and-drop powered by the HTML5 Drag API
      </p>
    </div>
  )
}
