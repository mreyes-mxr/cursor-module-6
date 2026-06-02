import { useState } from 'react'
import type { Post, Comment } from '../../types/feed'
import { CommentThread } from './CommentThread'
import { formatRelativeTime, formatCount } from './utils'

// ── Icons ────────────────────────────────────────────────────────────────────

function HeartIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  )
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500 shrink-0" aria-label="Verified">
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  )
}

// ── Comment input ─────────────────────────────────────────────────────────────

interface CommentInputProps {
  onSubmit: (text: string) => void
}

function CommentInput({ onSubmit }: CommentInputProps) {
  const [value, setValue] = useState('')

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit(value.trim())
      setValue('')
    }
  }

  return (
    <div className="flex gap-2 items-center mt-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
        Y
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Write a comment… (Enter to post)"
        className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  )
}

// ── PostCard ─────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked ?? false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [saved, setSaved] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>(post.comments)
  const [shareCount, setShareCount] = useState(post.shares)
  const [shared, setShared] = useState(false)
  const [imageExpanded, setImageExpanded] = useState(false)

  function handleLike() {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  function handleShare() {
    if (!shared) {
      setShareCount((c) => c + 1)
      setShared(true)
    }
  }

  function handleAddComment(text: string) {
    const newComment: Comment = {
      id: `new-${Date.now()}`,
      author: {
        id: 'me',
        name: 'You',
        username: 'you',
      },
      content: text,
      createdAt: new Date().toISOString(),
      likes: 0,
    }
    setComments((prev) => [newComment, ...prev])
    setShowComments(true)
  }

  return (
    <article className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          {post.author.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white dark:ring-gray-900"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
              {post.author.name[0]}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                {post.author.name}
              </span>
              {post.author.isVerified && <VerifiedBadge />}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>@{post.author.username}</span>
              <span>·</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>
        </div>
        <button
          aria-label="More options"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <p className="px-4 pb-3 text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Image */}
      {post.imageUrl && (
        <button
          onClick={() => setImageExpanded((v) => !v)}
          className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={imageExpanded ? 'Collapse image' : 'Expand image'}
        >
          <img
            src={post.imageUrl}
            alt="Post media"
            className={`w-full object-cover transition-all duration-300 ${
              imageExpanded ? 'max-h-[600px]' : 'max-h-72'
            }`}
          />
        </button>
      )}

      {/* Stats row */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1">
          <span className="text-base">❤️</span>
          <span>{formatCount(likeCount)}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments((v) => !v)}
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </button>
          <span>{formatCount(shareCount)} shares</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center border-t border-gray-100 dark:border-gray-800">
        <ActionButton
          icon={<HeartIcon filled={liked} />}
          label="Like"
          active={liked}
          activeColor="text-red-500"
          onClick={handleLike}
        />
        <ActionButton
          icon={<CommentIcon />}
          label="Comment"
          onClick={() => setShowComments((v) => !v)}
        />
        <ActionButton
          icon={<ShareIcon />}
          label="Share"
          active={shared}
          activeColor="text-green-600"
          onClick={handleShare}
        />
        <ActionButton
          icon={<BookmarkIcon filled={saved} />}
          label="Save"
          active={saved}
          activeColor="text-blue-600"
          onClick={() => setSaved((v) => !v)}
        />
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1">
          <CommentInput onSubmit={handleAddComment} />
          {comments.length > 0 && (
            <div className="mt-3">
              <CommentThread comments={comments} maxVisible={3} />
            </div>
          )}
        </div>
      )}
    </article>
  )
}

// ── Action button helper ──────────────────────────────────────────────────────

interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  activeColor?: string
  onClick: () => void
}

function ActionButton({ icon, label, active, activeColor = 'text-blue-600', onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors rounded-none
        ${active ? activeColor : 'text-gray-500 dark:text-gray-400'}
        hover:bg-gray-50 dark:hover:bg-gray-800`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
