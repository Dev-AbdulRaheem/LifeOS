# LifeOS: Personal Life Management Dashboard

LifeOS is a modern, responsive, frontend-only personal management dashboard built with React 18, Tailwind CSS, React Router v6, and Recharts.

Designed with a Linear/Notion/Todoist SaaS aesthetic, LifeOS unifies daily productivity into a single command center: tasks, habits, goals, calendar events, markdown notes, Pomodoro focus sessions, analytics, and data management.

---

## Features

- **Dashboard:** Dynamic greeting by time of day, 4 real-time stat cards, today's tasks & habits, active goals, weekly completion chart, upcoming events, and quick actions.
- **Tasks:** Full CRUD, priority (Low/Medium/High), categories, due dates, due times, search, multi-filter, sorting, and seamless toggle between **List view** and **Board (Kanban)** view.
- **Habits:** Daily completion tracking, current streak calculation, longest streak record, 30-day rate, and an interactive 7-day visual check-in strip.
- **Goals & Milestones:** Long-term target tracking with nested milestones and automatic progress calculation.
- **Calendar:** Custom-built interactive monthly calendar grid with daily agenda panel and category-colored indicators.
- **Notes:** Markdown-friendly notes with categories, tags, pinned notes, and an active/archived toggle.
- **Focus Timer (Pomodoro):** Accurate timestamp-based timer (Focus 25m, Short Break 5m, Long Break 15m), browser document title synchronization, sound alert ready, and automatic focus session history logging.
- **Analytics:** Data-driven visualizations including productivity scores, weekly task completion, habit consistency, and deep work focus time distribution (7-day / 30-day toggles).
- **Notifications:** Dropdown alert system seeded with realistic notifications, unread badges, mark-as-read, and automatic notifications on completing tasks, habits, and focus blocks.
- **Global Search:** `Ctrl/Cmd + K` spotlight search across all tasks, habits, goals, notes, and events with keyboard navigation.
- **Settings & Profile:** Light/Dark theme toggle (persisted to system preference or manual choice), timer duration customizations, task defaults, and complete **JSON Export, Import, and Reset** data management.

---

## Tech Stack

- **Framework:** React 18 (Vite JS template)
- **Styling:** Tailwind CSS v3.4 (`darkMode: 'class'`)
- **Routing:** React Router v6 (`react-router-dom`)
- **Charts:** Recharts
- **Icons:** lucide-react
- **Transitions:** framer-motion (used strictly for page transitions, modals/drawers, and list items)
- **State & Architecture:** Context API + Custom Hooks + Service Layer + LocalStorage

---

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Installation

```bash
# Clone or navigate to the repository
cd LifeOS

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Login

The application includes a demo authentication flow at `/login`. Any non-empty username and password will authenticate and direct you to the dashboard.

### Building for Production

```bash
npm run build
npm run preview
```
