import { useEffect, useRef, useState } from 'react'

interface InfiniteScrollLoaderProps {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}

export function InfiniteScrollLoader({ onLoadMore, hasMore, isLoading }: InfiniteScrollLoaderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && !triggered) {
          setTriggered(true)
          onLoadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore, triggered])

  useEffect(() => {
    if (!isLoading) setTriggered(false)
  }, [isLoading])

  if (!hasMore) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400">You're all caught up!</span>
        </div>
      </div>
    )
  }

  return (
    <div ref={sentinelRef} className="py-6 flex flex-col items-center gap-3" aria-live="polite" aria-label="Loading more posts">
      {isLoading ? (
        <>
          {/* Skeleton cards */}
          {[1, 2].map((i) => (
            <div
              key={i}
              className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 animate-pulse"
            >
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-32" />
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-4/6" />
              </div>
              <div className="h-36 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          ))}
        </>
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          Scroll for more
        </div>
      )}
    </div>
  )
}
