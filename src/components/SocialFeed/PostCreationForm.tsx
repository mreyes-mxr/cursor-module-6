import { useState, useRef } from 'react'
import type { Post } from '../../types/feed'

const ME = {
  id: 'me',
  name: 'You',
  username: 'you',
  isVerified: false,
}

interface PostCreationFormProps {
  onPost: (post: Post) => void
}

export function PostCreationForm({ onPost }: PostCreationFormProps) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const MAX_CHARS = 500
  const remaining = MAX_CHARS - content.length
  const canPost = content.trim().length > 0 && remaining >= 0

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canPost) return
    setIsSubmitting(true)

    await new Promise((r) => setTimeout(r, 400))

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: ME,
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
      likes: 0,
      shares: 0,
      isLiked: false,
      comments: [],
    }

    onPost(newPost)
    setContent('')
    setImageUrl('')
    setShowImageInput(false)
    setIsSubmitting(false)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white font-bold shrink-0">
          Y
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              autoResize()
            }}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full resize-none bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none leading-relaxed"
          />

          {/* Image URL input */}
          {showImageInput && (
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gray-400 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste an image URL…"
                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none"
              />
              <button
                type="button"
                onClick={() => { setShowImageInput(false); setImageUrl('') }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Image preview */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full max-h-48 object-cover rounded-xl"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Toolbar row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Photo button */}
              <ToolbarButton
                label="Add image"
                onClick={() => setShowImageInput((v) => !v)}
                active={showImageInput}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </ToolbarButton>

              {/* Emoji button (decorative) */}
              <ToolbarButton label="Add emoji" onClick={() => {}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </ToolbarButton>

              {/* Tag button (decorative) */}
              <ToolbarButton label="Tag someone" onClick={() => {}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-3">
              {/* Character count */}
              {content.length > 0 && (
                <span className={`text-xs tabular-nums ${
                  remaining < 50
                    ? remaining < 0
                      ? 'text-red-500 font-semibold'
                      : 'text-amber-500'
                    : 'text-gray-400'
                }`}>
                  {remaining}
                </span>
              )}

              {/* Post button */}
              <button
                type="submit"
                disabled={!canPost || isSubmitting}
                className="px-5 py-1.5 rounded-full bg-blue-600 text-white text-sm font-semibold transition-all
                  hover:bg-blue-700 active:scale-95
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Posting…
                  </span>
                ) : 'Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Toolbar button helper ─────────────────────────────────────────────────────

interface ToolbarButtonProps {
  label: string
  onClick: () => void
  active?: boolean
  children: React.ReactNode
}

function ToolbarButton({ label, onClick, active, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`p-1.5 rounded-full transition-colors ${
        active
          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
          : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
      }`}
    >
      {children}
    </button>
  )
}
