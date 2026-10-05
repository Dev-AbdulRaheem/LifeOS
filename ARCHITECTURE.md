# LifeOS Architecture & Data Flow Guide

LifeOS is architected for clean separation of concerns, readability for learners, and straightforward migration to a backend/database.

---

## 1. Data Flow Architecture

The data flows through 5 distinct layers:

```
[ UI Components ]
       │
       ▼
 [ Custom Hooks ]  (e.g., useTasks, useHabits, useTimer)
       │
       ▼
[ AppDataContext ] (Single source of truth in memory)
       │
       ▼
  [ Services ]     (Async CRUD functions with simulated latency)
       │
       ▼
 [ Storage Layer ] (localStorage via safe JSON wrapper)
```

### Why this design?
1. **Zero Component Coupling to Storage:** Components never touch `localStorage` or `fetch()`. They only interact with hooks.
2. **Predictable State Updates:** When an item is added or updated, the action goes to the Service, persists to storage, and updates Context state, causing all consuming components (like Dashboard and Tasks) to re-render in sync.
3. **Seamless Backend Migration:** All service functions are already `async` and return Promises. Swapping `localStorage` with `fetch('/api/tasks')` or `axios` requires editing only the `src/services/` files without modifying a single component.

---

## 2. Directory Structure

```
src/
├── assets/          # Static assets & illustrations
├── components/
│   ├── common/      # Reusable primitives (Button, Card, Modal, Input, Select, Badge, ProgressBar, Tabs, EmptyState, Spinner, ConfirmDialog, ErrorBoundary)
│   ├── layout/      # Sidebar, Topbar, and AppLayout shell
│   ├── tasks/       # TaskCard, TaskForm, TaskList, TaskBoard, TaskFilter, TaskModal, TaskStats
│   ├── notifications/# NotificationPanel dropdown
│   └── search/      # Global spotlight SearchModal
├── context/
│   ├── AuthContext.jsx       # Demo auth state (isAuthenticated, login, logout)
│   ├── ThemeContext.jsx      # Light/Dark mode with system preference detection
│   └── AppDataContext.jsx    # Central state provider holding all collections & actions
├── data/            # Dynamic date-relative seed data (mockTasks, mockHabits, etc.)
├── hooks/           # Thin consumer hooks (useTasks, useHabits, useGoals, useTimer, useDebounce, etc.)
├── pages/           # Routed views (DashboardPage, TasksPage, HabitsPage, FocusPage, etc.)
├── routes/          # AppRoutes.jsx and ProtectedRoute.jsx
├── services/        # Async CRUD abstraction layer (taskService, habitService, etc.)
└── utils/
    ├── storage.js       # Safe localStorage read/write with error fallbacks
    ├── dateUtils.js     # Native Date helper functions (no date-fns or moment)
    ├── calculations.js  # Pure analytics calculations (streaks, completion rates, scores)
    └── constants.js     # System configurations, categories, and colors
```

---

## 3. How to Connect a Real Backend (e.g. Node/Express, Supabase, or Firebase)

Because of the service layer pattern, connecting a backend is simple:

1. Open `src/services/taskService.js` (and other services).
2. Replace the `getItem` and `setItem` calls with HTTP requests:
   ```javascript
   // Before:
   export async function getTasks() {
     return simulate(getAll());
   }

   // After:
   export async function getTasks() {
     const res = await fetch('/api/tasks', { credentials: 'include' });
     if (!res.ok) throw new Error('Failed to fetch tasks');
     return res.json();
   }
   ```
3. Update `AuthContext.jsx` to verify JWT tokens or session cookies with your auth endpoint.
4. No changes are required in any page, hook, or component.
