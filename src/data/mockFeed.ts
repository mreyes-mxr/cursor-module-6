import type { Post, FeedUser } from '../types/feed'

const USERS: FeedUser[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    username: 'alexrivera',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    isVerified: true,
  },
  {
    id: 'u2',
    name: 'Jordan Lee',
    username: 'jordanlee',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    isVerified: false,
  },
  {
    id: 'u3',
    name: 'Sam Patel',
    username: 'sampatel',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
    isVerified: true,
  },
  {
    id: 'u4',
    name: 'Casey Morgan',
    username: 'caseymorgan',
    avatarUrl: 'https://i.pravatar.cc/150?img=60',
    isVerified: false,
  },
  {
    id: 'u5',
    name: 'Taylor Kim',
    username: 'taylorkim',
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
    isVerified: false,
  },
]

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: USERS[0],
    content:
      'Just shipped a huge feature update after weeks of work. The new dashboard is live and I couldn\'t be happier with how it turned out. Big thanks to the whole team for pushing through! 🚀',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    createdAt: '2026-06-01T14:30:00Z',
    likes: 142,
    shares: 18,
    isLiked: false,
    comments: [
      {
        id: 'c1',
        author: USERS[1],
        content: 'Congrats! That dashboard looks incredible. How did you handle the real-time updates?',
        createdAt: '2026-06-01T14:45:00Z',
        likes: 12,
        isLiked: false,
        replies: [
          {
            id: 'c1r1',
            author: USERS[0],
            content: 'We ended up using WebSockets — worked like a charm once we got the reconnection logic right.',
            createdAt: '2026-06-01T15:00:00Z',
            likes: 5,
            isLiked: false,
          },
        ],
      },
      {
        id: 'c2',
        author: USERS[2],
        content: 'This is inspiring! We\'ve been struggling with our own dashboard redesign. Would love to chat.',
        createdAt: '2026-06-01T15:10:00Z',
        likes: 8,
        isLiked: false,
      },
    ],
  },
  {
    id: 'p2',
    author: USERS[1],
    content:
      'Morning hike views hit differently when you leave your phone behind for a few hours. Highly recommend a digital detox weekend — came back with a clearer head and better ideas than I\'ve had in months.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    createdAt: '2026-06-01T09:00:00Z',
    likes: 287,
    shares: 34,
    isLiked: true,
    comments: [
      {
        id: 'c3',
        author: USERS[3],
        content: 'Where is this? It looks absolutely stunning!',
        createdAt: '2026-06-01T09:20:00Z',
        likes: 3,
        isLiked: false,
        replies: [
          {
            id: 'c3r1',
            author: USERS[1],
            content: 'Cascade Range in the Pacific Northwest. The trail to the summit takes about 4 hours but it\'s worth every step.',
            createdAt: '2026-06-01T09:35:00Z',
            likes: 6,
            isLiked: false,
          },
        ],
      },
    ],
  },
  {
    id: 'p3',
    author: USERS[2],
    content:
      'Hot take: the best productivity hack isn\'t a new app or system. It\'s simply deciding what NOT to do. I cut 30% of my task list last month and somehow got more done. Less is genuinely more.',
    createdAt: '2026-05-31T18:00:00Z',
    likes: 523,
    shares: 97,
    isLiked: false,
    comments: [
      {
        id: 'c4',
        author: USERS[4],
        content: 'This hit home. I\'ve been adding tasks faster than I complete them for years.',
        createdAt: '2026-05-31T18:15:00Z',
        likes: 44,
        isLiked: true,
      },
      {
        id: 'c5',
        author: USERS[0],
        content: 'Essentialism by Greg McKeown covers this perfectly. One of the most impactful reads of the year for me.',
        createdAt: '2026-05-31T19:00:00Z',
        likes: 21,
        isLiked: false,
      },
      {
        id: 'c6',
        author: USERS[3],
        content: 'The hard part is knowing which 30% to cut. Do you have a framework you follow?',
        createdAt: '2026-05-31T20:30:00Z',
        likes: 9,
        isLiked: false,
        replies: [
          {
            id: 'c6r1',
            author: USERS[2],
            content: 'Ask yourself: "If I could only do one thing on this list, what would it be?" — then do that and reassess everything else.',
            createdAt: '2026-05-31T21:00:00Z',
            likes: 17,
            isLiked: false,
          },
        ],
      },
    ],
  },
  {
    id: 'p4',
    author: USERS[3],
    content:
      'Finally finished my home studio setup after 6 months of saving and sourcing gear. Recorded my first proper demo track last night and it actually sounds good?? Still can\'t believe it.',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    createdAt: '2026-05-30T22:00:00Z',
    likes: 198,
    shares: 12,
    isLiked: false,
    comments: [
      {
        id: 'c7',
        author: USERS[4],
        content: 'This looks so professional! What mic are you running?',
        createdAt: '2026-05-30T22:30:00Z',
        likes: 7,
        isLiked: false,
      },
      {
        id: 'c8',
        author: USERS[1],
        content: 'Please share the track when you\'re ready. Would love to hear it!',
        createdAt: '2026-05-30T23:00:00Z',
        likes: 14,
        isLiked: false,
      },
    ],
  },
  {
    id: 'p5',
    author: USERS[4],
    content:
      'Quick reminder that it\'s okay to have a slow day. Not every day needs to be a hustle. Sometimes the most productive thing you can do is rest, recharge, and come back stronger tomorrow. 💙',
    createdAt: '2026-05-29T12:00:00Z',
    likes: 1204,
    shares: 310,
    isLiked: true,
    comments: [
      {
        id: 'c9',
        author: USERS[2],
        content: 'Needed to read this today. Thank you.',
        createdAt: '2026-05-29T12:10:00Z',
        likes: 88,
        isLiked: false,
      },
    ],
  },
]
