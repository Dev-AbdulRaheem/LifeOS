import { toDateString, subtractDays } from '../utils/dateUtils';

export function generateMockFocusSessions() {
  const sessions = [];
  // Generate 1-3 focus sessions per day for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = subtractDays(new Date(), i);
    const count = 1 + Math.floor(Math.random() * 3);
    for (let j = 0; j < count; j++) {
      sessions.push({
        id: crypto.randomUUID(),
        duration: [25, 25, 25, 50][Math.floor(Math.random() * 4)], // minutes
        type: 'focus',
        taskId: null,
        completedAt: date.toISOString(),
        createdAt: date.toISOString(),
      });
    }
  }
  return sessions;
}
