import type { Task, TaskStatus } from '../../types/task'
import { TaskCard } from './TaskCard'

// ── Column config ────────────────────────────────────────────────────────────

interface ColumnConfig {
  status: TaskStatus
  title: string
  accent: string        // left border + count badge colour
  headerBg: string      // subtle header background
  countBg: string       // pill background
  countText: string
  dropBorder: string    // dashed border when dragging over
}

export const COLUMN_CONFIG: Record<TaskStatus, ColumnConfig> = {
  todo: {
    status: 'todo',
    title: 'To Do',
    accent: 'border-l-slate-400',
    headerBg: 'bg-slate-50',
    countBg: 'bg-slate-200',
    countText: 'text-slate-700',
    dropBorder: 'border-slate-400',
  },
  'in-progress': {
    status: 'in-progress',
    title: 'In Progress',
    accent: 'border-l-blue-500',
    headerBg: 'bg-blue-50',
    countBg: 'bg-blue-200',
    countText: 'text-blue-700',
    dropBorder: 'border-blue-400',
  },
  done: {
    status: 'done',
    title: 'Done',
    accent: 'border-l-emerald-500',
    headerBg: 'bg-emerald-50',
    countBg: 'bg-emerald-200',
    countText: 'text-emerald-700',
    dropBorder: 'border-emerald-400',
  },
}

// ── Props ────────────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  isDragOver: boolean
  /** Placeholder: fires when a card is dragged over this column */
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  /** Placeholder: fires when a card is dropped on this column */
  onDrop: (e: React.DragEvent, targetStatus: TaskStatus) => void
  onDragStart: (taskId: string) => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function KanbanColumn({
  status,
  tasks,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
}: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status]

  return (
    <div
      className={`flex flex-col rounded-2xl border-l-4 border border-gray-200 ${config.accent} ${config.headerBg}
                  min-w-[280px] flex-1 max-w-sm transition-shadow duration-150
                  ${isDragOver ? 'shadow-lg ring-2 ring-offset-1 ring-blue-300' : 'shadow-sm'}`}
      onDragOver={(e) => { e.preventDefault(); onDragOver(e) }}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl ${config.headerBg}`}>
        <h2 className="text-sm font-semibold text-gray-800">{config.title}</h2>
        <span
          className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold ${config.countBg} ${config.countText}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Drop zone / card list */}
      <div
        className={`flex flex-col gap-3 p-3 flex-1 min-h-[240px] rounded-b-2xl transition-all
                    ${
                      isDragOver
                        ? `border-2 border-dashed ${config.dropBorder} bg-white/60 m-2 rounded-xl`
                        : ''
                    }`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}

        {/* Empty state */}
        {tasks.length === 0 && !isDragOver && (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-xs text-gray-400 italic">No tasks here</p>
          </div>
        )}

        {/* Drop placeholder shown when dragging over */}
        {isDragOver && (
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-current py-6 text-xs font-medium opacity-60">
            Drop here
          </div>
        )}
      </div>
    </div>
  )
}
