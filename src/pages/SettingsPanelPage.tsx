import { SettingsPanel } from '../components/SettingsPanel'

export function SettingsPanelPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Settings panel
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Showcasing the{' '}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-gray-700 dark:text-gray-300">
            {'<SettingsPanel />'}
          </code>{' '}
          component with tabs, form inputs, toggles, and dropdowns.
        </p>
      </div>

      <SettingsPanel />
    </main>
  )
}
