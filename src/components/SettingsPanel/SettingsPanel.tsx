import { useEffect, useId, useRef, useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = 'profile' | 'notifications' | 'privacy' | 'appearance'
type Theme = 'light' | 'dark' | 'system'
type FontSize = 'sm' | 'md' | 'lg'

interface ProfileForm {
  name: string
  username: string
  email: string
  bio: string
  website: string
  location: string
}

interface NotifSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  weeklyDigest: boolean
  newFollower: boolean
  mentions: boolean
  directMessages: boolean
}

interface PrivacySettings {
  privateAccount: boolean
  showActivity: boolean
  allowTagging: boolean
  dataSharingAnalytics: boolean
  dataSharingAds: boolean
  whoCanSeeEmail: 'everyone' | 'followers' | 'nobody'
  whoCanComment: 'everyone' | 'followers' | 'nobody'
}

interface AppearanceSettings {
  theme: Theme
  fontSize: FontSize
  language: string
  reducedMotion: boolean
  highContrast: boolean
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('dark', 'light')
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.add('light')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) root.classList.add('dark')
  }
  localStorage.setItem('theme', theme)
}

function getSavedTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) ?? 'system'
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
  { value: 'pt', label: 'Português' },
  { value: 'ar', label: 'العربية' },
]

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'appearance', label: 'Appearance' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  id?: string
}

function Toggle({ checked, onChange, label, description, id }: ToggleProps) {
  const autoId = useId()
  const toggleId = id ?? autoId

  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-col min-w-0">
        <label
          htmlFor={toggleId}
          className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer select-none"
        >
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        id={toggleId}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
          checked
            ? 'bg-blue-600 dark:bg-blue-500'
            : 'bg-gray-200 dark:bg-gray-700',
        ].join(' ')}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={[
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm',
            'transform transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </div>
  )
}

interface FieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}

function Field({ label, htmlFor, required, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="ml-1 text-red-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 ' +
  'px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ' +
  'disabled:opacity-50 disabled:cursor-not-allowed transition-colors'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string
}

function Select({ children, className = '', ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={[
        inputCls,
        'cursor-pointer appearance-none bg-no-repeat pr-8',
        'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")] bg-[length:20px_20px] bg-[position:right_8px_center]',
        className,
      ].join(' ')}
    >
      {children}
    </select>
  )
}

interface SectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

function Section({ title, description, children }: SectionProps) {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="mb-3">
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </span>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </legend>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/60 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4">
        {children}
      </div>
    </fieldset>
  )
}

interface SaveBarProps {
  onSave: () => void
  onReset: () => void
  saved: boolean
  saving: boolean
}

function SaveBar({ onSave, onReset, saved, saving }: SaveBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={onReset}
        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        Reset
      </button>
      <div className="flex items-center gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Saved
          </span>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 dark:bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

// ── Tab panels ────────────────────────────────────────────────────────────────

function ProfileTab() {
  const [form, setForm] = useState<ProfileForm>({
    name: 'Alex Rivera',
    username: 'alexrivera',
    email: 'alex@example.com',
    bio: 'Product designer and occasional writer. Lover of great UX.',
    website: 'https://alexrivera.dev',
    location: 'San Francisco, CA',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function set(field: keyof ProfileForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      setSaved(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    savedTimerRef.current = setTimeout(() => setSaved(false), 3000)
  }

  function handleReset() {
    setForm({
      name: 'Alex Rivera',
      username: 'alexrivera',
      email: 'alex@example.com',
      bio: 'Product designer and occasional writer. Lover of great UX.',
      website: 'https://alexrivera.dev',
      location: 'San Francisco, CA',
    })
    setSaved(false)
  }

  useEffect(() => () => { if (savedTimerRef.current) clearTimeout(savedTimerRef.current) }, [])

  return (
    <div className="space-y-8">
      {/* Avatar section */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold select-none" aria-hidden="true">
            {form.name.charAt(0)}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Profile photo</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Upload photo
            </button>
            <button
              type="button"
              className="text-xs text-red-500 dark:text-red-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
            >
              Remove
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">JPG, GIF or PNG. 2MB max.</p>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full name" htmlFor="profile-name" required>
          <input
            id="profile-name"
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="Your full name"
            className={inputCls}
            required
            autoComplete="name"
          />
        </Field>

        <Field label="Username" htmlFor="profile-username" required>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500 text-sm">
              @
            </span>
            <input
              id="profile-username"
              type="text"
              value={form.username}
              onChange={set('username')}
              placeholder="username"
              className={`${inputCls} pl-7`}
              required
              autoComplete="username"
            />
          </div>
        </Field>

        <Field label="Email address" htmlFor="profile-email" required hint="Used for notifications and account recovery.">
          <input
            id="profile-email"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
            className={inputCls}
            required
            autoComplete="email"
          />
        </Field>

        <Field label="Location" htmlFor="profile-location" hint="City, country or region.">
          <input
            id="profile-location"
            type="text"
            value={form.location}
            onChange={set('location')}
            placeholder="San Francisco, CA"
            className={inputCls}
            autoComplete="country-name"
          />
        </Field>

        <Field label="Website" htmlFor="profile-website" hint="Include https://." className="sm:col-span-2">
          <input
            id="profile-website"
            type="url"
            value={form.website}
            onChange={set('website')}
            placeholder="https://yoursite.com"
            className={inputCls}
            autoComplete="url"
          />
        </Field>

        <Field label="Bio" htmlFor="profile-bio" hint={`${form.bio.length}/160 characters`} className="sm:col-span-2">
          <textarea
            id="profile-bio"
            value={form.bio}
            onChange={set('bio')}
            placeholder="Tell people a little about yourself…"
            rows={3}
            maxLength={160}
            className={`${inputCls} resize-none`}
          />
        </Field>
      </div>

      <SaveBar onSave={handleSave} onReset={handleReset} saved={saved} saving={saving} />
    </div>
  )
}

function NotificationsTab() {
  const [notifs, setNotifs] = useState<NotifSettings>({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    weeklyDigest: true,
    newFollower: true,
    mentions: true,
    directMessages: true,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function toggle(key: keyof NotifSettings) {
    return (val: boolean) => {
      setNotifs((n) => ({ ...n, [key]: val }))
      setSaved(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    savedTimerRef.current = setTimeout(() => setSaved(false), 3000)
  }

  function handleReset() {
    setNotifs({
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
      weeklyDigest: true,
      newFollower: true,
      mentions: true,
      directMessages: true,
    })
    setSaved(false)
  }

  useEffect(() => () => { if (savedTimerRef.current) clearTimeout(savedTimerRef.current) }, [])

  return (
    <div className="space-y-6">
      <Section title="Delivery channels" description="Choose how you receive notifications.">
        <Toggle
          checked={notifs.emailNotifications}
          onChange={toggle('emailNotifications')}
          label="Email notifications"
          description="Receive updates directly in your inbox."
        />
        <Toggle
          checked={notifs.pushNotifications}
          onChange={toggle('pushNotifications')}
          label="Push notifications"
          description="Get real-time alerts on your device."
        />
        <Toggle
          checked={notifs.marketingEmails}
          onChange={toggle('marketingEmails')}
          label="Marketing emails"
          description="News, product updates, and promotional offers."
        />
        <Toggle
          checked={notifs.weeklyDigest}
          onChange={toggle('weeklyDigest')}
          label="Weekly digest"
          description="A summary of activity sent every Monday morning."
        />
      </Section>

      <Section title="Activity alerts" description="Control which events trigger a notification.">
        <Toggle
          checked={notifs.newFollower}
          onChange={toggle('newFollower')}
          label="New followers"
          description="When someone starts following you."
        />
        <Toggle
          checked={notifs.mentions}
          onChange={toggle('mentions')}
          label="Mentions &amp; tags"
          description="When someone @mentions you in a post or comment."
        />
        <Toggle
          checked={notifs.directMessages}
          onChange={toggle('directMessages')}
          label="Direct messages"
          description="When you receive a new DM."
        />
      </Section>

      <SaveBar onSave={handleSave} onReset={handleReset} saved={saved} saving={saving} />
    </div>
  )
}

function PrivacyTab() {
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    privateAccount: false,
    showActivity: true,
    allowTagging: true,
    dataSharingAnalytics: true,
    dataSharingAds: false,
    whoCanSeeEmail: 'followers',
    whoCanComment: 'everyone',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function toggle(key: keyof PrivacySettings) {
    return (val: boolean) => {
      setPrivacy((p) => ({ ...p, [key]: val }))
      setSaved(false)
    }
  }

  function setSelect(key: keyof PrivacySettings) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPrivacy((p) => ({ ...p, [key]: e.target.value }))
      setSaved(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    savedTimerRef.current = setTimeout(() => setSaved(false), 3000)
  }

  function handleReset() {
    setPrivacy({
      privateAccount: false,
      showActivity: true,
      allowTagging: true,
      dataSharingAnalytics: true,
      dataSharingAds: false,
      whoCanSeeEmail: 'followers',
      whoCanComment: 'everyone',
    })
    setSaved(false)
  }

  useEffect(() => () => { if (savedTimerRef.current) clearTimeout(savedTimerRef.current) }, [])

  return (
    <div className="space-y-6">
      <Section title="Account visibility" description="Control who can see your profile and content.">
        <Toggle
          checked={privacy.privateAccount}
          onChange={toggle('privateAccount')}
          label="Private account"
          description="Only approved followers can see your posts."
        />
        <Toggle
          checked={privacy.showActivity}
          onChange={toggle('showActivity')}
          label="Show activity status"
          description="Let others see when you were last active."
        />
        <Toggle
          checked={privacy.allowTagging}
          onChange={toggle('allowTagging')}
          label="Allow tagging"
          description="Anyone can tag you in posts and photos."
        />
      </Section>

      <Section title="Audience controls">
        <div className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label htmlFor="who-can-see-email" className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
            Who can see my email
          </label>
          <Select
            id="who-can-see-email"
            value={privacy.whoCanSeeEmail}
            onChange={setSelect('whoCanSeeEmail')}
            className="sm:w-40"
          >
            <option value="everyone">Everyone</option>
            <option value="followers">Followers only</option>
            <option value="nobody">Nobody</option>
          </Select>
        </div>
        <div className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label htmlFor="who-can-comment" className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
            Who can comment on my posts
          </label>
          <Select
            id="who-can-comment"
            value={privacy.whoCanComment}
            onChange={setSelect('whoCanComment')}
            className="sm:w-40"
          >
            <option value="everyone">Everyone</option>
            <option value="followers">Followers only</option>
            <option value="nobody">Nobody</option>
          </Select>
        </div>
      </Section>

      <Section title="Data &amp; personalization" description="Manage how your data is used to improve your experience.">
        <Toggle
          checked={privacy.dataSharingAnalytics}
          onChange={toggle('dataSharingAnalytics')}
          label="Share analytics data"
          description="Help us improve by sending anonymous usage data."
        />
        <Toggle
          checked={privacy.dataSharingAds}
          onChange={toggle('dataSharingAds')}
          label="Personalized ads"
          description="Allow us to use your data to tailor advertisements."
        />
      </Section>

      <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4">
        <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Danger zone</h3>
        <p className="mt-1 text-xs text-red-600 dark:text-red-400/80">
          These actions are permanent and cannot be undone.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-transparent px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Download my data
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-transparent px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Delete account
          </button>
        </div>
      </div>

      <SaveBar onSave={handleSave} onReset={handleReset} saved={saved} saving={saving} />
    </div>
  )
}

function AppearanceTab() {
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => ({
    theme: getSavedTheme(),
    fontSize: 'md',
    language: 'en',
    reducedMotion: false,
    highContrast: false,
  }))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function toggle(key: keyof AppearanceSettings) {
    return (val: boolean) => {
      setAppearance((a) => ({ ...a, [key]: val }))
      setSaved(false)
    }
  }

  function handleThemeChange(theme: Theme) {
    setAppearance((a) => ({ ...a, theme }))
    applyTheme(theme)
    setSaved(false)
  }

  function handleFontSizeChange(fontSize: FontSize) {
    setAppearance((a) => ({ ...a, fontSize }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    savedTimerRef.current = setTimeout(() => setSaved(false), 3000)
  }

  function handleReset() {
    const defaultTheme: Theme = 'system'
    setAppearance({
      theme: defaultTheme,
      fontSize: 'md',
      language: 'en',
      reducedMotion: false,
      highContrast: false,
    })
    applyTheme(defaultTheme)
    setSaved(false)
  }

  useEffect(() => () => { if (savedTimerRef.current) clearTimeout(savedTimerRef.current) }, [])

  const THEME_OPTIONS: { value: Theme; label: string; description: string }[] = [
    { value: 'light', label: 'Light', description: 'Always use light theme' },
    { value: 'dark', label: 'Dark', description: 'Always use dark theme' },
    { value: 'system', label: 'System', description: 'Match your OS preference' },
  ]

  const FONT_SIZE_OPTIONS: { value: FontSize; label: string; preview: string }[] = [
    { value: 'sm', label: 'Small', preview: 'Aa' },
    { value: 'md', label: 'Medium', preview: 'Aa' },
    { value: 'lg', label: 'Large', preview: 'Aa' },
  ]

  return (
    <div className="space-y-6">
      {/* Theme */}
      <fieldset>
        <legend className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
          Theme
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map(({ value, label, description }) => {
            const isSelected = appearance.theme === value
            return (
              <label
                key={value}
                className={[
                  'relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors',
                  isSelected
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="theme"
                  value={value}
                  checked={isSelected}
                  onChange={() => handleThemeChange(value)}
                  className="sr-only"
                />
                {/* Theme preview swatch */}
                <div
                  aria-hidden="true"
                  className={[
                    'h-12 w-full max-w-[80px] rounded-lg border',
                    value === 'light'
                      ? 'bg-white border-gray-200'
                      : value === 'dark'
                      ? 'bg-gray-900 border-gray-700'
                      : 'bg-gradient-to-r from-white to-gray-900 border-gray-300',
                  ].join(' ')}
                />
                <div className="text-center">
                  <div className={`text-sm font-medium ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    {label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{description}</div>
                </div>
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                    <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                    </svg>
                  </span>
                )}
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Font size */}
      <fieldset>
        <legend className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
          Text size
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {FONT_SIZE_OPTIONS.map(({ value, label, preview }) => {
            const isSelected = appearance.fontSize === value
            const previewSize = value === 'sm' ? 'text-base' : value === 'md' ? 'text-xl' : 'text-2xl'
            return (
              <label
                key={value}
                className={[
                  'flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-colors',
                  isSelected
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="fontSize"
                  value={value}
                  checked={isSelected}
                  onChange={() => handleFontSizeChange(value)}
                  className="sr-only"
                />
                <span className={`font-semibold text-gray-800 dark:text-gray-200 ${previewSize}`} aria-hidden="true">
                  {preview}
                </span>
                <span className={`text-xs font-medium ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  {label}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Language */}
      <Field label="Language" htmlFor="language-select">
        <Select
          id="language-select"
          value={appearance.language}
          onChange={(e) => {
            setAppearance((a) => ({ ...a, language: e.target.value }))
            setSaved(false)
          }}
        >
          {LANGUAGES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </Field>

      {/* Accessibility */}
      <Section title="Accessibility" description="Optimize the interface for your needs.">
        <Toggle
          checked={appearance.reducedMotion}
          onChange={toggle('reducedMotion')}
          label="Reduce motion"
          description="Minimize animations and transitions."
        />
        <Toggle
          checked={appearance.highContrast}
          onChange={toggle('highContrast')}
          label="High contrast"
          description="Increase color contrast for better readability."
        />
      </Section>

      <SaveBar onSave={handleSave} onReset={handleReset} saved={saved} saving={saving} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    profile: null,
    notifications: null,
    privacy: null,
    appearance: null,
  })

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab)
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (currentIndex + 1) % TABS.length
    if (e.key === 'ArrowLeft') next = (currentIndex - 1 + TABS.length) % TABS.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = TABS.length - 1
    if (next !== null) {
      e.preventDefault()
      const nextTab = TABS[next]
      setActiveTab(nextTab.id)
      tabRefs.current[nextTab.id]?.focus()
    }
  }

  const panelId = (tab: Tab) => `settings-panel-${tab}`
  const tabId = (tab: Tab) => `settings-tab-${tab}`

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 m-0">
            Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account preferences and configuration.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row min-h-[520px]">
          {/* Sidebar tab list */}
          <div
            role="tablist"
            aria-label="Settings sections"
            aria-orientation="vertical"
            onKeyDown={handleKeyDown}
            className="flex sm:flex-col gap-0.5 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-2 sm:p-3 sm:w-44 shrink-0 overflow-x-auto"
          >
            {TABS.map(({ id, label }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  role="tab"
                  id={tabId(id)}
                  aria-selected={isActive}
                  aria-controls={panelId(id)}
                  tabIndex={isActive ? 0 : -1}
                  ref={(el) => { tabRefs.current[id] = el }}
                  onClick={() => setActiveTab(id)}
                  className={[
                    'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-left transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    isActive
                      ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/60 dark:hover:bg-gray-700/50',
                  ].join(' ')}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Tab panels */}
          <div className="flex-1 min-w-0">
            {TABS.map(({ id }) => (
              <div
                key={id}
                role="tabpanel"
                id={panelId(id)}
                aria-labelledby={tabId(id)}
                hidden={activeTab !== id}
                className="p-6"
              >
                {activeTab === id && (
                  <>
                    {id === 'profile' && <ProfileTab />}
                    {id === 'notifications' && <NotificationsTab />}
                    {id === 'privacy' && <PrivacyTab />}
                    {id === 'appearance' && <AppearanceTab />}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
