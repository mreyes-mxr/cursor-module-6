interface StatCardProps {
  label: string
  value: number
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold text-gray-900 tabular-nums">
        {formatCount(value)}
      </span>
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
    </div>
  )
}
