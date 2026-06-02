import { useState } from 'react'
import type { Comment } from '../../types/feed'
import { formatRelativeTime } from './utils'

interface CommentItemProps {
  comment: Comment
  isReply?: boolean
}

function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [liked, setLiked] = useState(comment.isLiked ?? false)
  const [likeCount, setLikeCount] = useState(comment.likes)
  const [showReplies, setShowReplies] = useState(false)

  function handleLike() {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <div className={`flex gap-2.5 ${isReply ? 'ml-9 mt-2' : ''}`}>
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        {comment.author.avatarUrl ? (
          <img
            src={comment.author.avatarUrl}
            alt={comment.author.name}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
            {comment.author.name[0]}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="inline-block max-w-full bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-3 py-2">
          <span className="font-semibold text-xs text-gray-900 dark:text-gray-100 mr-1.5">
            {comment.author.name}
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-300 break-words">
            {comment.content}
          </span>
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-3 mt-1 px-1">
          <span className="text-xs text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
          <button
            onClick={handleLike}
            className={`text-xs font-semibold transition-colors ${
              liked ? 'text-red-500' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {liked ? '❤️' : 'Like'} {likeCount > 0 && <span className="font-normal">{likeCount}</span>}
          </button>
          {!isReply && (
            <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              Reply
            </button>
          )}
        </div>

        {/* Toggle replies */}
        {!isReply && comment.replies && comment.replies.length > 0 && (
          <button
            onClick={() => setShowReplies((v) => !v)}
            className="mt-1 px-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showReplies
              ? 'Hide replies'
              : `View ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
          </button>
        )}

        {/* Replies */}
        {showReplies && comment.replies?.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply />
        ))}
      </div>
    </div>
  )
}

interface CommentThreadProps {
  comments: Comment[]
  maxVisible?: number
}

export function CommentThread({ comments, maxVisible = 2 }: CommentThreadProps) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? comments : comments.slice(0, maxVisible)
  const hidden = comments.length - maxVisible

  return (
    <div className="space-y-3">
      {visible.map((c) => (
        <CommentItem key={c.id} comment={c} />
      ))}
      {!showAll && hidden > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="ml-9 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View {hidden} more {hidden === 1 ? 'comment' : 'comments'}
        </button>
      )}
    </div>
  )
}
