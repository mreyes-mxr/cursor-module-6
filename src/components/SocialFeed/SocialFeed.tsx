import { useState, useCallback } from 'react'
import type { Post } from '../../types/feed'
import { PostCard } from './PostCard'
import { PostCreationForm } from './PostCreationForm'
import { InfiniteScrollLoader } from './InfiniteScrollLoader'

const BATCH_SIZE = 3

interface SocialFeedProps {
  initialPosts: Post[]
  /** Additional posts to load in batches when the user scrolls */
  extraPosts?: Post[]
}

export function SocialFeed({ initialPosts, extraPosts = [] }: SocialFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loadedCount, setLoadedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const hasMore = loadedCount < extraPosts.length

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1200))
    const next = extraPosts.slice(loadedCount, loadedCount + BATCH_SIZE)
    setPosts((prev) => [...prev, ...next])
    setLoadedCount((c) => c + next.length)
    setIsLoading(false)
  }, [isLoading, hasMore, extraPosts, loadedCount])

  function handleNewPost(post: Post) {
    setPosts((prev) => [post, ...prev])
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Post creation */}
      <PostCreationForm onPost={handleNewPost} />

      {/* Filter tabs */}
      <FeedTabs />

      {/* Posts */}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Infinite scroll sentinel + skeletons */}
      <InfiniteScrollLoader
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
    </div>
  )
}

// ── Feed filter tabs ──────────────────────────────────────────────────────────

const TABS = ['For You', 'Following', 'Trending', 'Discover'] as const
type Tab = (typeof TABS)[number]

function FeedTabs() {
  const [active, setActive] = useState<Tab>('For You')

  return (
    <div className="flex gap-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-1.5 shadow-sm">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            active === tab
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
