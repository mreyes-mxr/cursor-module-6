import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/layout'
import { HomePage } from './pages/HomePage'
import { UserProfilesPage } from './pages/UserProfilesPage'
import { ProductCardsPage } from './pages/ProductCardsPage'
import { TaskManagementPage } from './pages/TaskManagementPage'
import { SettingsPanelPage } from './pages/SettingsPanelPage'
import { SocialFeedPage } from './pages/SocialFeedPage'
import { KanbanBoardPage } from './pages/KanbanBoardPage'

function App() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
        <Header
          title="Cursor apps showcase"
          isDark={isDark}
          toggleTheme={() => setIsDark((d) => !d)}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user-profiles" element={<UserProfilesPage />} />
          <Route path="/product-cards" element={<ProductCardsPage />} />
          <Route path="/task-management" element={<TaskManagementPage />} />
          <Route path="/settings" element={<SettingsPanelPage />} />
          <Route path="/social-feed" element={<SocialFeedPage />} />
          <Route path="/kanban" element={<KanbanBoardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
