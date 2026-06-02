import { useState } from 'react'
import { UserProfile } from '../components/UserProfile'
import { CURRENT_USER, MOCK_USERS } from '../data/mockUsers'

type FollowState = Record<string, boolean>

const OTHER_USERS = MOCK_USERS.filter((u) => u.id !== CURRENT_USER.id)

export function UserProfilesPage() {
  const [followState, setFollowState] = useState<FollowState>({})

  function toggleFollow(userId: string) {
    setFollowState((prev) => ({ ...prev, [userId]: !prev[userId] }))
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      {/* Page header */}
      <div className="w-full max-w-2xl mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          User Profiles
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Showcasing the{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700">
            &lt;UserProfile /&gt;
          </code>{' '}
          component across a variety of account types and data shapes.
        </p>

        {/* Legend */}
        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { term: 'Own profile', desc: 'Shows "Edit Profile" button' },
            { term: 'Following', desc: 'Button toggles follow state' },
            { term: 'Minimal data', desc: 'Optional fields omitted gracefully' },
          ].map(({ term, desc }) => (
            <div
              key={term}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
            >
              <dt className="text-xs font-semibold text-gray-900">{term}</dt>
              <dd className="mt-0.5 text-xs text-gray-500">{desc}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── Your own profile ─────────────────────────────────── */}
      <Section label="Your Profile · isOwnProfile">
        <UserProfile
          user={CURRENT_USER}
          isOwnProfile
          onEditProfile={() => alert('Open edit profile form')}
        />
      </Section>

      {/* ── Other users ─────────────────────────────────────── */}
      <Section label="Other Users · follow / message">
        <div className="space-y-6 w-full">
          {OTHER_USERS.map((user) => (
            <UserProfile
              key={user.id}
              user={user}
              isOwnProfile={false}
              isFollowing={!!followState[user.id]}
              onFollow={() => toggleFollow(user.id)}
              onMessage={(id) => alert(`Open DM with user ${id}`)}
            />
          ))}
        </div>
      </Section>
    </main>
  )
}

// ── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="w-full max-w-2xl mb-12">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 px-1">
        {label}
      </h2>
      {children}
    </section>
  )
}
