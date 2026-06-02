export interface UserStats {
  posts: number
  followers: number
  following: number
}

export type ProfileAction = 'follow' | 'unfollow' | 'message' | 'edit'

export interface User {
  id: string
  name: string
  username: string
  bio?: string
  avatarUrl?: string
  coverUrl?: string
  location?: string
  website?: string
  joinedAt: string
  stats: UserStats
  isVerified?: boolean
}

export interface UserProfileProps {
  user: User
  /** Whether the viewer is looking at their own profile */
  isOwnProfile?: boolean
  /** Whether the viewer already follows this user */
  isFollowing?: boolean
  onFollow?: (userId: string) => void
  onMessage?: (userId: string) => void
  onEditProfile?: () => void
}
