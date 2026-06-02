import { type UserProfileProps } from '../../types/user'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { StatCard } from '../ui/StatCard'
import { VerifiedBadge } from '../ui/VerifiedBadge'

// ── Icon helpers ────────────────────────────────────────────────────────────

function LocationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0">
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0">
      <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
      <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
      <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.671 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
      <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
      <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
    </svg>
  )
}

// ── Cover image ─────────────────────────────────────────────────────────────

function CoverPhoto({ src }: { src?: string }) {
  return (
    <div
      className="h-36 w-full sm:h-48 rounded-t-2xl overflow-hidden bg-gradient-to-br from-violet-400 via-blue-400 to-cyan-400"
      aria-hidden="true"
    >
      {src && (
        <img src={src} alt="" className="size-full object-cover" />
      )}
    </div>
  )
}

// ── Action buttons ───────────────────────────────────────────────────────────

interface ActionButtonsProps {
  userId: string
  isOwnProfile: boolean
  isFollowing: boolean
  onFollow?: (id: string) => void
  onMessage?: (id: string) => void
  onEditProfile?: () => void
}

function ActionButtons({
  userId,
  isOwnProfile,
  isFollowing,
  onFollow,
  onMessage,
  onEditProfile,
}: ActionButtonsProps) {
  if (isOwnProfile) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={onEditProfile}
        aria-label="Edit your profile"
        className="gap-1.5"
      >
        <EditIcon />
        Edit Profile
      </Button>
    )
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={isFollowing ? 'secondary' : 'primary'}
        size="sm"
        onClick={() => onFollow?.(userId)}
        aria-pressed={isFollowing}
        aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onMessage?.(userId)}
        aria-label="Send a message"
        className="gap-1.5"
      >
        <MessageIcon />
        Message
      </Button>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function UserProfile({
  user,
  isOwnProfile = false,
  isFollowing = false,
  onFollow,
  onMessage,
  onEditProfile,
}: UserProfileProps) {
  const {
    id,
    name,
    username,
    bio,
    avatarUrl,
    coverUrl,
    location,
    website,
    joinedAt,
    stats,
    isVerified,
  } = user

  const joinedYear = new Date(joinedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const displayWebsite = website
    ?.replace(/^https?:\/\//, '')
    .replace(/\/$/, '')

  return (
    <article
      aria-label={`${name}'s profile`}
      className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Cover */}
      <CoverPhoto src={coverUrl} />

      {/* Avatar row */}
      <div className="flex items-end justify-between px-5 sm:px-6 -mt-12 sm:-mt-14">
        <Avatar
          src={avatarUrl}
          alt={name}
          size="xl"
          className="ring-4 ring-white"
        />
        <div className="pb-2">
          <ActionButtons
            userId={id}
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            onFollow={onFollow}
            onMessage={onMessage}
            onEditProfile={onEditProfile}
          />
        </div>
      </div>

      {/* Identity */}
      <div className="px-5 sm:px-6 pt-3 pb-4 space-y-3">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              {name}
            </h1>
            {isVerified && <VerifiedBadge />}
          </div>
          <p className="text-sm text-gray-500">@{username}</p>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-sm leading-relaxed text-gray-700 max-w-prose">
            {bio}
          </p>
        )}

        {/* Meta */}
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Profile details">
          {location && (
            <li className="flex items-center gap-1 text-sm text-gray-500">
              <LocationIcon />
              <span>{location}</span>
            </li>
          )}
          {website && (
            <li className="flex items-center gap-1 text-sm">
              <LinkIcon />
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                {displayWebsite}
              </a>
            </li>
          )}
          <li className="flex items-center gap-1 text-sm text-gray-500">
            <CalendarIcon />
            <span>Joined {joinedYear}</span>
          </li>
        </ul>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* Stats */}
        <div
          className="flex justify-around sm:justify-start sm:gap-10"
          role="group"
          aria-label="Profile statistics"
        >
          <StatCard label="Posts" value={stats.posts} />
          <StatCard label="Followers" value={stats.followers} />
          <StatCard label="Following" value={stats.following} />
        </div>
      </div>
    </article>
  )
}
