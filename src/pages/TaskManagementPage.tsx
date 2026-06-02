import { useState, useRef, useEffect } from 'react'
import { mockTasks } from '../data/mockTasks'
import type { Task, TaskStatus, TaskPriority } from '../types/task'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconCheckCircle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconClock({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconListBullet({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  )
}

function IconExclamationTriangle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

function IconSearch({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function IconBell({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  )
}

function IconChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function IconPlus({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function IconHome({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}

function IconChartBar({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}

function IconUsers({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function IconCog({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function IconLogout({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  )
}

function IconUser({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isOverdue(iso: string, status: TaskStatus): boolean {
  if (status === 'done') return false
  return new Date(iso) < new Date()
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; classes: string }> = {
  low:    { label: 'Low',    classes: 'bg-gray-100 text-gray-600' },
  medium: { label: 'Medium', classes: 'bg-blue-100 text-blue-700' },
  high:   { label: 'High',   classes: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Urgent', classes: 'bg-red-100 text-red-700' },
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; dotClass: string }> = {
  'todo':        { label: 'To Do',       dotClass: 'bg-gray-400' },
  'in-progress': { label: 'In Progress', dotClass: 'bg-blue-500' },
  'done':        { label: 'Done',        dotClass: 'bg-emerald-500' },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type FilterView = TaskStatus | 'all' | 'urgent'

interface SidebarProps {
  activeView: FilterView
  onViewChange: (v: FilterView) => void
  counts: Record<FilterView, number>
}

function Sidebar({ activeView, onViewChange, counts }: SidebarProps) {
  const navItems: { id: FilterView; label: string; icon: React.ReactNode }[] = [
    { id: 'all',         label: 'All Tasks',    icon: <IconHome className="w-5 h-5" /> },
    { id: 'todo',        label: 'To Do',        icon: <IconListBullet className="w-5 h-5" /> },
    { id: 'in-progress', label: 'In Progress',  icon: <IconClock className="w-5 h-5" /> },
    { id: 'done',        label: 'Done',         icon: <IconCheckCircle className="w-5 h-5" /> },
    { id: 'urgent',      label: 'High Priority', icon: <IconExclamationTriangle className="w-5 h-5" /> },
  ]

  const extraItems = [
    { label: 'Analytics',  icon: <IconChartBar className="w-5 h-5" /> },
    { label: 'Team',       icon: <IconUsers className="w-5 h-5" /> },
    { label: 'Settings',   icon: <IconCog className="w-5 h-5" /> },
  ]

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-4 pt-6 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">Views</p>
        <nav>
          <ul className="space-y-0.5">
            {navItems.map(({ id, label, icon }) => {
              const active = activeView === id
              return (
                <li key={id}>
                  <button
                    onClick={() => onViewChange(id)}
                    className={[
                      'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-3">
                      {icon}
                      {label}
                    </span>
                    <span className={[
                      'text-xs px-1.5 py-0.5 rounded-full font-semibold tabular-nums',
                      active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500',
                    ].join(' ')}>
                      {counts[id]}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">More</p>
        <nav>
          <ul className="space-y-0.5">
            {extraItems.map(({ label, icon }) => (
              <li key={label}>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                  {icon}
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-100">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-800 mb-1">Pro tip</p>
          <p className="text-xs text-blue-600">Use keyboard shortcut <kbd className="bg-blue-100 px-1 rounded text-xs">N</kbd> to quickly add a new task.</p>
        </div>
      </div>
    </aside>
  )
}

interface StatWidgetProps {
  label: string
  value: number
  sub: string
  color: string
  icon: React.ReactNode
}

function StatWidget({ label, value, sub, color, icon }: StatWidgetProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 tabular-nums leading-none">{value}</p>
        <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  )
}

function TaskCard({ task }: { task: Task }) {
  const priority = PRIORITY_CONFIG[task.priority]
  const status   = STATUS_CONFIG[task.status]
  const overdue  = isOverdue(task.dueDate, task.status)

  return (
    <div className={[
      'bg-white rounded-xl border p-5 flex flex-col gap-3 hover:shadow-md transition-shadow',
      task.status === 'done' ? 'border-gray-200 opacity-75' : 'border-gray-200',
    ].join(' ')}>
      {/* top row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className={[
          'font-semibold text-gray-900 leading-snug',
          task.status === 'done' ? 'line-through text-gray-400' : '',
        ].join(' ')}>
          {task.title}
        </h3>
        <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${priority.classes}`}>
          {priority.label}
        </span>
      </div>

      {/* description */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{task.description}</p>

      {/* tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* footer */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.dotClass}`} />
          <span className="text-xs font-medium text-gray-500">{status.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
            {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
          </span>
          <div
            className={`w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center ${task.assignee.color}`}
            title={task.assignee.name}
          >
            {task.assignee.initials}
          </div>
        </div>
      </div>
    </div>
  )
}

function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white text-sm font-bold flex items-center justify-center">
          JS
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-800 leading-none">Jane Smith</p>
          <p className="text-xs text-gray-400 mt-0.5">Product Manager</p>
        </div>
        <IconChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1.5 z-50">
          <div className="px-4 py-2 border-b border-gray-100 mb-1">
            <p className="text-sm font-semibold text-gray-800">Jane Smith</p>
            <p className="text-xs text-gray-400">jane@acme.io</p>
          </div>
          {[
            { icon: <IconUser className="w-4 h-4" />, label: 'Your Profile' },
            { icon: <IconCog className="w-4 h-4" />,  label: 'Settings' },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={() => setOpen(false)}
            >
              {icon}{label}
            </button>
          ))}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <IconLogout className="w-4 h-4" />Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function TaskManagementPage() {
  const [activeView, setActiveView] = useState<FilterView>('all')
  const [search, setSearch] = useState('')

  const counts: Record<FilterView, number> = {
    all:           mockTasks.length,
    todo:          mockTasks.filter(t => t.status === 'todo').length,
    'in-progress': mockTasks.filter(t => t.status === 'in-progress').length,
    done:          mockTasks.filter(t => t.status === 'done').length,
    urgent:        mockTasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length,
  }

  const overdueCount = mockTasks.filter(t => isOverdue(t.dueDate, t.status)).length
  const completionRate = Math.round((counts.done / mockTasks.length) * 100)

  const filteredTasks = mockTasks.filter(task => {
    const matchesView =
      activeView === 'all'         ? true :
      activeView === 'urgent'      ? (task.priority === 'urgent' || task.priority === 'high') :
      task.status === activeView

    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q) ||
      task.tags.some(tag => tag.includes(q))

    return matchesView && matchesSearch
  })

  const viewLabel: Record<FilterView, string> = {
    all:           'All Tasks',
    todo:          'To Do',
    'in-progress': 'In Progress',
    done:          'Done',
    urgent:        'High Priority',
  }

  return (
    <main className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} counts={counts} />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Inner header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shrink-0">
          <div className="relative flex-1 max-w-md">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <IconBell className="w-5 h-5" />
              {overdueCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <UserMenu />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatWidget
              label="Total Tasks"
              value={counts.all}
              sub="across all categories"
              color="bg-blue-50"
              icon={<IconListBullet className="w-6 h-6 text-blue-600" />}
            />
            <StatWidget
              label="Completed"
              value={counts.done}
              sub={`${completionRate}% completion rate`}
              color="bg-emerald-50"
              icon={<IconCheckCircle className="w-6 h-6 text-emerald-600" />}
            />
            <StatWidget
              label="In Progress"
              value={counts['in-progress']}
              sub="actively being worked"
              color="bg-violet-50"
              icon={<IconClock className="w-6 h-6 text-violet-600" />}
            />
            <StatWidget
              label="Overdue"
              value={overdueCount}
              sub="need immediate attention"
              color={overdueCount > 0 ? 'bg-red-50' : 'bg-gray-50'}
              icon={<IconExclamationTriangle className={`w-6 h-6 ${overdueCount > 0 ? 'text-red-500' : 'text-gray-400'}`} />}
            />
          </div>

          {/* Section header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{viewLabel[activeView]}</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                {search && ` matching "${search}"`}
              </p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <IconPlus className="w-4 h-4" />
              New Task
            </button>
          </div>

          {/* Task grid */}
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <IconSearch className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No tasks found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
