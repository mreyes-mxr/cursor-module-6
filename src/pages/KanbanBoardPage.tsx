import { KanbanBoard } from '../components/KanbanBoard'
import { mockTasks } from '../data/mockTasks'

export function KanbanBoardPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-10 min-h-0">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Kanban Board
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Visualise and manage tasks across{' '}
            <span className="font-medium text-gray-700">To Do</span>,{' '}
            <span className="font-medium text-gray-700">In Progress</span>, and{' '}
            <span className="font-medium text-gray-700">Done</span>. Drag cards
            between columns to update their status.
          </p>

          {/* Legend */}
          <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { term: 'Urgent', dot: 'bg-red-500', desc: 'Needs immediate action' },
              { term: 'High', dot: 'bg-orange-500', desc: 'Top of the backlog' },
              { term: 'Medium', dot: 'bg-yellow-400', desc: 'Planned for this sprint' },
              { term: 'Low', dot: 'bg-green-400', desc: 'Nice to have' },
            ].map(({ term, dot, desc }) => (
              <div
                key={term}
                className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm"
              >
                <span className={`mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${dot}`} />
                <div>
                  <dt className="text-xs font-semibold text-gray-800">{term}</dt>
                  <dd className="text-[11px] text-gray-500">{desc}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Board */}
        <KanbanBoard initialTasks={mockTasks} />
      </div>
    </main>
  )
}
