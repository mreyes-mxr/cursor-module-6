# Cursor Apps Showcase

A collection of interactive React UI components built as part of Module 6. The app demonstrates common interface patterns — from a kanban board to a social feed — all within a single-page application with dark mode support.

---

## Components

### Feature Components

| Component | Description |
|---|---|
| **KanbanBoard** | Three-column task board (To Do / In Progress / Done) with drag-and-drop via the HTML5 Drag API and a live progress bar. |
| **ProductCard** | E-commerce card displaying product image, star rating, price with optional discount pill, and an animated Add to Cart button. |
| **SettingsPanel** | Tabbed settings UI covering Profile, Notifications, Privacy, and Appearance sections with toggles, selects, and a save/reset flow. |
| **SocialFeed** | Social feed with a post-creation form, filter tabs, per-post comment threads, and infinite-scroll pagination. |
| **UserProfile** | Profile card showing avatar, cover photo, bio, stats (posts / followers / following), verified badge, and follow/message actions. |

### UI Primitives

| Component | Description |
|---|---|
| **Avatar** | Circular user avatar with fallback initials. |
| **Button** | Reusable button with variant and size props. |
| **StatCard** | Small metric card used on the home page dashboard. |
| **VerifiedBadge** | Inline badge indicating a verified account. |

### Layout

| Component | Description |
|---|---|
| **Header** | Top navigation bar with app title and a light/dark mode toggle. Preference is persisted to `localStorage`. |

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| [React](https://react.dev) | 19 | UI library |
| [TypeScript](https://www.typescriptlang.org) | 6 | Type safety |
| [Vite](https://vite.dev) | 8 | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |
| [React Router DOM](https://reactrouter.com) | 7 | Client-side routing |
| [ESLint](https://eslint.org) | 10 | Linting (with React Hooks and React Refresh plugins) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- npm (bundled with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone [<repository-url>](https://github.com/mreyes-mxr/cursor-module-6.git)
cd module-6

# 2. Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

The development server starts with hot module replacement. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Scripts

```bash
# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview

# Run the linter
npm run lint
```

---

## Project Structure

```
src/
├── components/
│   ├── KanbanBoard/      # Kanban board with drag-and-drop
│   ├── ProductCard/      # E-commerce product card
│   ├── SettingsPanel/    # Multi-tab settings panel
│   ├── SocialFeed/       # Social feed with infinite scroll
│   ├── UserProfile/      # User profile card
│   ├── layout/           # Header and page-level layout
│   └── ui/               # Shared primitives (Avatar, Button, StatCard, VerifiedBadge)
├── data/                 # Mock data for all components
├── pages/                # Route-level page components
└── types/                # Shared TypeScript interfaces
```

---

## E2E Testing

This project uses [Playwright](https://playwright.dev) for end-to-end testing. Tests cover complete user workflows, accessibility requirements, responsive design, and error/edge-case handling across all 7 routes.

### Test Folder Structure

```
e2e/
├── home/               # Home page tests
├── navigation/         # Header & burger menu tests
├── user-profiles/      # UserProfile component tests (follow, message, edit)
├── product-cards/      # ProductCard tests (add to cart, toast, out-of-stock)
├── task-management/    # Task Management dashboard tests (search, filters)
├── settings/           # SettingsPanel tests (tabs, toggles, save/reset, keyboard nav)
├── social-feed/        # SocialFeed tests (post creation, tabs, infinite scroll)
├── kanban/             # KanbanBoard tests (drag-and-drop, progress bar)
├── accessibility/      # Cross-page WCAG-aligned accessibility tests
└── responsive/         # Cross-page responsive design tests (mobile/tablet/desktop)
```

### Prerequisites

Before running tests, make sure dependencies are installed and browsers are downloaded:

```bash
# Install project dependencies (includes Playwright)
npm install

# Download browser binaries (only needed once)
npx playwright install
```

> **Note:** To install only the Chromium browser (faster download):
> ```bash
> npx playwright install chromium
> ```

### Running Tests

#### Run all tests (all browsers)

```bash
npm run test:e2e
```

#### Run tests with the interactive Playwright UI

```bash
npm run test:e2e:ui
```

#### Run tests in headed mode (visible browser window)

```bash
npm run test:e2e:headed
```

#### Run tests for a single browser

```bash
# Chromium only (fastest for local development)
npm run test:e2e:chromium

# Mobile browsers only
npm run test:e2e:mobile
```

#### Run tests for a specific feature folder

```bash
npm run test:e2e:home           # Home page
npm run test:e2e:navigation     # Header / navigation
npm run test:e2e:user-profiles  # User Profiles page
npm run test:e2e:product-cards  # Product Cards page
npm run test:e2e:task-management # Task Management page
npm run test:e2e:settings       # Settings Panel page
npm run test:e2e:social-feed    # Social Feed page
npm run test:e2e:kanban         # Kanban Board page
npm run test:e2e:accessibility  # Accessibility tests (all pages)
npm run test:e2e:responsive     # Responsive design tests (all pages)
```

#### View the HTML test report

```bash
npm run test:e2e:report
```

### Playwright Configuration

The configuration lives in `playwright.config.ts` at the project root. Key settings:

| Setting | Value |
|---|---|
| Test directory | `./e2e` |
| Base URL | `http://localhost:5173` |
| Browsers | Chromium, Firefox, WebKit, Pixel 5 (Chrome), iPhone 13 (Safari) |
| Web server | Vite dev server (`npm run dev`) started automatically |
| Retries on CI | 2 |
| Trace | On first retry |
| Screenshots | On failure only |
| Video | Retained on failure |

The Vite dev server is started automatically before tests run and reused if already running locally.

### What Is Tested

| Area | Coverage |
|---|---|
| **Home page** | Heading, description, menu navigation, landmark roles, heading hierarchy |
| **Header** | Logo link, Home nav link, dark mode toggle (aria, persistence), burger menu open/close, search filter, keyboard (Enter, Escape), active state, responsive sticky behavior |
| **User Profiles** | Own profile (edit button), other profiles (follow/unfollow toggle, message), card content (name, @username, stats, joined date), aria-label on articles, aria-pressed on follow, independent follow states per card |
| **Product Cards** | Cart counter increments, toast appears/disappears, button state changes (Added → revert), out-of-stock disabled button, badge/discount pills, aria-label on buttons, live regions, grid columns per breakpoint |
| **Task Management** | Page renders, stat widgets, search filters tasks, filter sidebar, priority labels, due dates, responsive layouts |
| **Settings Panel** | Tab switching, Profile/Notifications/Privacy/Appearance panels, form fields pre-filled, bio character counter, save/reset flow (800ms async), toggle switches, audience selects, danger zone buttons, theme change applies dark class, keyboard arrow/Home/End tab navigation, aria-selected, aria-controls, tabIndex management |
| **Social Feed** | Post creation (textarea → submit → appears in feed), empty post button disabled, filter tab active state, like button interaction, scroll-triggered infinite load, suggested users follow toggle |
| **Kanban Board** | Three columns visible, progress bar and text, task cards (draggable, priority, assignee, due date, tags), drag-and-drop via dispatchEvent, progress updates |
| **Accessibility** | All pages have `<header>`, `<main>` landmarks and at least one heading; zero JS errors across all routes; focus management; aria attributes (aria-pressed, aria-checked, aria-live, aria-hidden, aria-controls, aria-selected, tabIndex); required attribute on form fields; dark mode on every route |
| **Responsive** | Every page at 375px (mobile), 768px (tablet), 1280px (desktop), 1440px (wide); grid column classes verified; sticky header; horizontal scroll on Kanban |
