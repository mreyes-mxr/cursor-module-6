import { useState } from 'react'
import { MOCK_POSTS } from '../data/mockFeed'
import { SocialFeed } from '../components/SocialFeed'

// Show first 3 posts immediately; serve the rest in infinite-scroll batches
const INITIAL = MOCK_POSTS.slice(0, 3)
const EXTRA = MOCK_POSTS.slice(3)

export function SocialFeedPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8">
      {/* Page header */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Media Feed
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Stay up to date with posts from your network.
            </p>
          </div>

          {/* Notification bell */}
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {/* Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-950" />
          </button>
        </div>

        {/* Who to follow strip */}
        <SuggestedUsers />
      </div>

      {/* Feed */}
      <div className="w-full max-w-2xl">
        <SocialFeed initialPosts={INITIAL} extraPosts={EXTRA} />
      </div>
    </main>
  )
}

// ── Suggested users strip ─────────────────────────────────────────────────────

const SUGGESTIONS = [
  { id: 's1', name: 'Morgan T.', username: 'morgant', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 's2', name: 'Riley C.', username: 'rileyc', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 's3', name: 'Quinn A.', username: 'quinna', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: 's4', name: 'Drew B.', username: 'drewb', avatar: 'https://i.pravatar.cc/150?img=22' },
  { id: 's5', name: 'Avery N.', username: 'averyn', avatar: 'https://i.pravatar.cc/150?img=38' },
]

function SuggestedUsers() {
  const [followed, setFollowed] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setFollowed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="mt-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Suggested for you
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {SUGGESTIONS.map((u) => {
          const isFollowed = followed.has(u.id)
          return (
            <div
              key={u.id}
              className="flex flex-col items-center gap-2 min-w-[72px]"
            >
              <img
                src={u.avatar}
                alt={u.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
              />
              <div className="text-center">
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate max-w-[72px]">
                  {u.name}
                </p>
                <p className="text-[10px] text-gray-400 truncate max-w-[72px]">@{u.username}</p>
              </div>
              <button
                onClick={() => toggle(u.id)}
                className={`px-3 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  isFollowed
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowed ? 'Following' : 'Follow'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

