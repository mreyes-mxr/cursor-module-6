export interface FeedUser {
  id: string
  name: string
  username: string
  avatarUrl?: string
  isVerified?: boolean
}

export interface Comment {
  id: string
  author: FeedUser
  content: string
  createdAt: string
  likes: number
  isLiked?: boolean
  replies?: Comment[]
}

export interface Post {
  id: string
  author: FeedUser
  content: string
  imageUrl?: string
  createdAt: string
  likes: number
  shares: number
  isLiked?: boolean
  comments: Comment[]
}
