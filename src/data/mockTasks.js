import { toDateString, addDays, subtractDays } from '../utils/dateUtils';

export function generateMockTasks() {
  const today = new Date();
  return [
    {
      id: crypto.randomUUID(),
      title: 'Review pull request for auth module',
      description: 'Check the new authentication flow implementation and provide feedback',
      priority: 'high',
      category: 'Work',
      status: 'todo',
      dueDate: toDateString(today),
      dueTime: '10:00',
      createdAt: subtractDays(today, 2).toISOString(),
      updatedAt: subtractDays(today, 2).toISOString(),
      completedAt: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, fruits, vegetables',
      priority: 'medium',
      category: 'Personal',
      status: 'todo',
      dueDate: toDateString(today),
      dueTime: '18:00',
      createdAt: subtractDays(today, 1).toISOString(),
      updatedAt: subtractDays(today, 1).toISOString(),
      completedAt: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Complete React tutorial chapter 5',
      description: 'Hooks, context, and state management patterns',
      priority: 'medium',
      category: 'Learning',
      status: 'in-progress',
      dueDate: toDateString(addDays(today, 1)),
      dueTime: null,
      createdAt: subtractDays(today, 3).toISOString(),
      updatedAt: subtractDays(today, 1).toISOString(),
      completedAt: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Schedule dentist appointment',
      description: 'Regular checkup - Dr. Smith\'s office',
      priority: 'low',
      category: 'Health',
      status: 'todo',
      dueDate: toDateString(addDays(today, 3)),
      dueTime: null,
      createdAt: subtractDays(today, 5).toISOString(),
      updatedAt: subtractDays(today, 5).toISOString(),
      completedAt: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Prepare monthly budget report',
      description: 'Track expenses and income for this month',
      priority: 'high',
      category: 'Finance',
      status: 'todo',
      dueDate: toDateString(addDays(today, 2)),
      dueTime: '14:00',
      createdAt: subtractDays(today, 1).toISOString(),
      updatedAt: subtractDays(today, 1).toISOString(),
      completedAt: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Morning workout routine',
      description: '30 min cardio + 20 min strength training',
      priority: 'medium',
      category: 'Health',
      status: 'completed',
      dueDate: toDateString(today),
      dueTime: '07:00',
      createdAt: subtractDays(today, 1).toISOString(),
      updatedAt: today.toISOString(),
      completedAt: today.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Send project proposal to client',
      description: 'Final draft with updated timeline and budget',
      priority: 'high',
      category: 'Work',
      status: 'completed',
      dueDate: toDateString(subtractDays(today, 1)),
      dueTime: '16:00',
      createdAt: subtractDays(today, 4).toISOString(),
      updatedAt: subtractDays(today, 1).toISOString(),
      completedAt: subtractDays(today, 1).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Update portfolio website',
      description: 'Add recent projects and update skills section',
      priority: 'low',
      category: 'Personal',
      status: 'in-progress',
      dueDate: toDateString(addDays(today, 5)),
      dueTime: null,
      createdAt: subtractDays(today, 7).toISOString(),
      updatedAt: subtractDays(today, 2).toISOString(),
      completedAt: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Read Clean Code chapter 3',
      description: 'Functions - how to write clean functions',
      priority: 'low',
      category: 'Learning',
      status: 'completed',
      dueDate: toDateString(subtractDays(today, 2)),
      dueTime: null,
      createdAt: subtractDays(today, 6).toISOString(),
      updatedAt: subtractDays(today, 2).toISOString(),
      completedAt: subtractDays(today, 2).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Fix navigation bug in mobile app',
      description: 'The bottom tab navigator loses state when switching tabs',
      priority: 'high',
      category: 'Work',
      status: 'in-progress',
      dueDate: toDateString(addDays(today, 1)),
      dueTime: '12:00',
      createdAt: subtractDays(today, 2).toISOString(),
      updatedAt: today.toISOString(),
      completedAt: null,
    },
    // Past completed tasks for analytics
    ...generatePastCompletedTasks(),
  ];
}

function generatePastCompletedTasks() {
  const tasks = [];
  const categories = ['Work', 'Personal', 'Learning', 'Health', 'Finance'];
  const titles = [
    'Review code changes', 'Update documentation', 'Team standup prep',
    'Clean workspace', 'Reply to emails', 'Exercise session', 'Read article',
    'Organize files', 'Weekly planning', 'Fix CSS issue', 'Database backup',
    'Write unit tests', 'Grocery shopping', 'Pay bills', 'Meal prep',
  ];

  for (let i = 1; i <= 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // 1-4 tasks completed per day
    const count = 1 + Math.floor(Math.random() * 4);
    for (let j = 0; j < count; j++) {
      tasks.push({
        id: crypto.randomUUID(),
        title: titles[Math.floor(Math.random() * titles.length)],
        description: '',
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        category: categories[Math.floor(Math.random() * categories.length)],
        status: 'completed',
        dueDate: toDateString(date),
        dueTime: null,
        createdAt: new Date(date.getTime() - 86400000).toISOString(),
        updatedAt: date.toISOString(),
        completedAt: date.toISOString(),
      });
    }
  }
  return tasks;
}
