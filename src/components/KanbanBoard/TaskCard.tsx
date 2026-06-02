import type { Task, TaskPriority } from '../../types/task'

// ── Priority config ──────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; dot: string; badge: string }
> = {
  urgent: {
    label: 'Urgent',
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 ring-red-200',
  },
  high: {
    label: 'High',
    dot: 'bg-orange-500',
    badge: 'bg-orange-50 text-orange-700 ring-orange-200',
  },
  medium: {
    label: 'Medium',
    dot: 'bg-yellow-400',
    badge: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  },
  low: {
    label: 'Low',
    dot: 'bg-green-400',
    badge: 'bg-green-50 text-green-700 ring-green-200',
  },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDueDate(iso: string): { label: string; overdue: boolean } {
  const due = new Date(iso)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((due.getTime() - today.getTime()) / 86_400_000)

  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, overdue: true }
  if (diff === 0) return { label: 'Due today', overdue: false }
  if (diff === 1) return { label: 'Due tomorrow', overdue: false }
  return {
    label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overdue: false,
  }
}

// ── Props ────────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task
  /** Called when the card drag starts — placeholder for DnD wiring */
  onDragStart?: (taskId: string) => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  const priority = PRIORITY_CONFIG[task.priority]
  const due = formatDueDate(task.dueDate)

  return (
    <div
      draggable
      onDragStart={() => onDragStart?.(task.id)}
      className="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm
                 cursor-grab active:cursor-grabbing active:shadow-lg active:scale-[1.02]
                 hover:shadow-md hover:border-gray-300 transition-all duration-150 select-none"
    >
      {/* Drag handle hint */}
      <div
        aria-hidden
        className="absolute right-3 top-3 flex flex-col gap-[3px] opacity-0 group-hover:opacity-40 transition-opacity"
      >
        {[0, 1, 2].map((i) => (
          <span key={i} className="block h-[3px] w-4 rounded-full bg-gray-400" />
        ))}
      </div>

      {/* Priority badge */}
      <div className="mb-2 flex items-center gap-1.5">
        <span className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${priority.dot}`} />
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${priority.badge}`}
        >
          {priority.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1 pr-5">
        {task.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
        {task.description}
      </p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: assignee + due date */}
      <div className="flex items-center justify-between mt-auto pt-1 border-t border-gray-100">
        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white flex-shrink-0 ${task.assignee.color}`}
            title={task.assignee.name}
          >
            {task.assignee.initials}
          </span>
          <span className="text-[11px] text-gray-500 truncate max-w-[80px]">
            {task.assignee.name.split(' ')[0]}
          </span>
        </div>

        {/* Due date */}
        <div
          className={`flex items-center gap-1 text-[11px] font-medium ${
            due.overdue ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          <svg
            className="h-3 w-3 flex-shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="2" y="3" width="12" height="12" rx="2" />
            <path d="M5 1v3M11 1v3M2 7h12" />
          </svg>
          <span>{due.label}</span>
        </div>
      </div>
    </div>
  )
}
