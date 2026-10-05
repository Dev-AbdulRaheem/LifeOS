import { toDateString, subtractDays } from '../utils/dateUtils';

// Generate completion history for the last N days with a given probability
function generateCompletions(probability, days = 30) {
  const completions = [];
  for (let i = 0; i < days; i++) {
    if (Math.random() < probability) {
      completions.push(toDateString(subtractDays(new Date(), i)));
    }
  }
  return completions;
}

export function generateMockHabits() {
  return [
    {
      id: crypto.randomUUID(),
      title: 'Exercise',
      description: 'At least 30 minutes of physical activity',
      category: 'Health',
      icon: '🏋️',
      color: '#ef4444',
      completions: generateCompletions(0.75),
      createdAt: subtractDays(new Date(), 45).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Reading',
      description: 'Read for at least 20 minutes',
      category: 'Learning',
      icon: '📚',
      color: '#3b82f6',
      completions: generateCompletions(0.65),
      createdAt: subtractDays(new Date(), 60).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Coding',
      description: 'Write code or practice algorithms for 1 hour',
      category: 'Productivity',
      icon: '💻',
      color: '#8b5cf6',
      completions: generateCompletions(0.8),
      createdAt: subtractDays(new Date(), 90).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Drink Water',
      description: 'Drink at least 8 glasses of water',
      category: 'Health',
      icon: '💧',
      color: '#06b6d4',
      completions: generateCompletions(0.85),
      createdAt: subtractDays(new Date(), 30).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Sleep Early',
      description: 'Be in bed by 11 PM',
      category: 'Wellness',
      icon: '🌙',
      color: '#6366f1',
      completions: generateCompletions(0.55),
      createdAt: subtractDays(new Date(), 30).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}
