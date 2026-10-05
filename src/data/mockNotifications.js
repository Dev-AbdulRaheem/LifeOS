import { subtractDays } from '../utils/dateUtils';

export function generateMockNotifications() {
  const now = new Date();
  return [
    {
      id: crypto.randomUUID(),
      type: 'task',
      title: 'Task Due Today',
      message: 'Review pull request for auth module is due today',
      read: false,
      createdAt: now.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      type: 'habit',
      title: 'Streak Milestone! 🔥',
      message: 'You have a 7-day streak on Coding! Keep it up!',
      read: false,
      createdAt: subtractDays(now, 0.1).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      type: 'goal',
      title: 'Milestone Reached',
      message: 'You completed "React" milestone in Become Full Stack Developer',
      read: false,
      createdAt: subtractDays(now, 1).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      type: 'focus',
      title: 'Focus Session Complete',
      message: 'Great job! You completed a 25-minute focus session.',
      read: true,
      createdAt: subtractDays(now, 1).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      type: 'task',
      title: 'Task Completed',
      message: 'You completed "Send project proposal to client"',
      read: true,
      createdAt: subtractDays(now, 2).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      type: 'habit',
      title: 'Don\'t break the chain!',
      message: 'You haven\'t completed "Sleep Early" today. Still time!',
      read: true,
      createdAt: subtractDays(now, 2).toISOString(),
    },
  ];
}
