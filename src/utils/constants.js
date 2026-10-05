export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' },
  high: { label: 'High', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
};

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const STATUS_CONFIG = {
  'todo': { label: 'To Do', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  'in-progress': { label: 'In Progress', color: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' },
  'completed': { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

export const TASK_CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Finance', 'Other'];

export const EVENT_CATEGORIES = {
  meeting: { label: 'Meeting', color: 'bg-blue-500' },
  personal: { label: 'Personal', color: 'bg-green-500' },
  health: { label: 'Health', color: 'bg-red-500' },
  social: { label: 'Social', color: 'bg-purple-500' },
  work: { label: 'Work', color: 'bg-yellow-500' },
  other: { label: 'Other', color: 'bg-gray-500' },
};

export const NOTE_CATEGORIES = ['Personal', 'Work', 'Ideas', 'Learning', 'Health', 'Finance'];

export const HABIT_CATEGORIES = ['Health', 'Productivity', 'Learning', 'Wellness', 'Social'];

export const GOAL_CATEGORIES = ['Career', 'Health', 'Learning', 'Finance', 'Personal'];

export const FOCUS_MODES = {
  FOCUS: 'focus',
  SHORT_BREAK: 'short-break',
  LONG_BREAK: 'long-break',
};

export const DEFAULT_FOCUS_DURATIONS = {
  focus: 25,
  'short-break': 5,
  'long-break': 15,
};

export const STORAGE_KEYS = {
  TASKS: 'lifeos:tasks',
  HABITS: 'lifeos:habits',
  GOALS: 'lifeos:goals',
  NOTES: 'lifeos:notes',
  EVENTS: 'lifeos:events',
  FOCUS_SESSIONS: 'lifeos:focus-sessions',
  NOTIFICATIONS: 'lifeos:notifications',
  PROFILE: 'lifeos:profile',
  SETTINGS: 'lifeos:settings',
  AUTH: 'lifeos:auth',
  THEME: 'lifeos:theme',
};

export const SORT_OPTIONS = {
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
  CREATED: 'createdAt',
  TITLE: 'title',
};
