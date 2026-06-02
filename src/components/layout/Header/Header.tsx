import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

interface HeaderProps {
  title?: string
  isDark?: boolean
  toggleTheme?: () => void
}

const HOME_LINK = { to: '/', label: 'Home', end: true }

const BURGER_LINKS = [
  { to: '/user-profiles', label: 'User Profiles', end: false },
  { to: '/product-cards', label: 'Product Cards', end: false },
  { to: '/task-management', label: 'Task Management', end: false },
  { to: '/settings', label: 'Settings Panel', end: false },
  { to: '/social-feed', label: 'Media Feed', end: false },
  { to: '/kanban', label: 'Kanban Board', end: false },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    isActive
      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
  ].join(' ')

export function Header({ title = 'My App', isDark = false, toggleTheme }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const filteredLinks = BURGER_LINKS.filter((l) =>
    l.label.toLowerCase().includes(search.toLowerCase()),
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navigate to first result on Enter
  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && filteredLinks.length > 0) {
      navigate(filteredLinks[0].to)
      setMenuOpen(false)
      setSearch('')
    }
    if (e.key === 'Escape') {
      setMenuOpen(false)
      setSearch('')
    }
  }

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4 sticky top-0 z-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between">

        {/* Logo + title */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2s-5 5-5 10a5 5 0 0 0 10 0C17 7 12 2 12 2z" />
            <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
            <path d="M9 17.5 7 21" />
            <path d="M15 17.5 17 21" />
            <path d="M8 13.5C6.5 14 5 15 5 17" />
            <path d="M16 13.5C17.5 14 19 15 19 17" />
          </svg>
          {title}
        </NavLink>

        {/* Right side nav */}
        <nav aria-label="Main navigation" className="flex items-center gap-1">

          {/* Home — always visible */}
          <NavLink
            to={HOME_LINK.to}
            end={HOME_LINK.end}
            className={navLinkClass}
          >
            {HOME_LINK.label}
          </NavLink>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 mx-1',
              isDark ? 'bg-indigo-500' : 'bg-gray-300',
            ].join(' ')}
          >
            {/* Sun icon on track — visible in light mode */}
            <span className="absolute left-0.5 flex h-5 w-5 items-center justify-center">
              <svg
                className={`absolute transition-opacity duration-200 text-yellow-400 ${isDark ? 'opacity-0' : 'opacity-100'}`}
                width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            {/* Thumb */}
            <span
              className={[
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 flex items-center justify-center',
                isDark ? 'translate-x-5' : 'translate-x-0.5',
              ].join(' ')}
            >
              {isDark ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-500" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-yellow-500" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </span>
          </button>

          {/* Burger menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                setMenuOpen((o) => !o)
                setSearch('')
              }}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {menuOpen ? (
                // X icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                // Hamburger icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3 z-50">

                {/* Search input */}
                <div className="relative mb-2">
                  <svg
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search menu…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    autoFocus
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  />
                </div>

                {/* Filtered nav links */}
                <ul className="space-y-0.5">
                  {filteredLinks.length > 0 ? (
                    filteredLinks.map(({ to, label, end }) => (
                      <li key={to}>
                        <NavLink
                          to={to}
                          end={end}
                          className={navLinkClass}
                          onClick={() => {
                            setMenuOpen(false)
                            setSearch('')
                          }}
                        >
                          {label}
                        </NavLink>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-sm text-gray-400">No results</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
