import { getTodayString, getLastNDays, toDateString } from './dateUtils';

// Analytics calculation functions - all pure, derived from app state

export function getTasksCompletedToday(tasks) {
  const today = getTodayString();
  return tasks.filter(t => t.status === 'completed' && t.completedAt && toDateString(t.completedAt) === today).length;
}

export function getTasksCompletedOnDate(tasks, dateStr) {
  return tasks.filter(t => t.status === 'completed' && t.completedAt && toDateString(t.completedAt) === dateStr).length;
}

export function getWeeklyTaskCompletion(tasks, days = 7) {
  return getLastNDays(days).map(date => ({
    date,
    label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    completed: getTasksCompletedOnDate(tasks, date),
  }));
}

export function getHabitCompletionRate(habit) {
  if (!habit.completions || habit.completions.length === 0) return 0;
  const last30 = getLastNDays(30);
  const completed = last30.filter(d => habit.completions.includes(d)).length;
  return Math.round((completed / 30) * 100);
}

export function getCurrentStreak(habit) {
  if (!habit.completions || habit.completions.length === 0) return 0;
  const sorted = [...habit.completions].sort().reverse();
  const today = getTodayString();
  let streak = 0;
  let checkDate = today;

  // Allow today to be incomplete - start from yesterday if today not done
  if (!sorted.includes(today)) {
    const yesterday = toDateString(new Date(Date.now() - 86400000));
    if (!sorted.includes(yesterday)) return 0;
    checkDate = yesterday;
  }

  while (sorted.includes(checkDate)) {
    streak++;
    const prev = new Date(checkDate);
    prev.setDate(prev.getDate() - 1);
    checkDate = toDateString(prev);
  }
  return streak;
}

export function getLongestStreak(habit) {
  if (!habit.completions || habit.completions.length === 0) return 0;
  const sorted = [...habit.completions].sort();
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((curr - prev) / 86400000);
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }
  return maxStreak;
}

export function getHabitConsistencyData(habits, days = 7) {
  const dates = getLastNDays(days);
  return dates.map(date => {
    const total = habits.length;
    const completed = habits.filter(h => h.completions && h.completions.includes(date)).length;
    return {
      date,
      label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      completed,
      total,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });
}

export function getFocusTimeToday(focusSessions) {
  const today = getTodayString();
  return focusSessions
    .filter(s => toDateString(s.completedAt) === today)
    .reduce((sum, s) => sum + (s.duration || 0), 0);
}

export function getFocusTimeByDay(focusSessions, days = 7) {
  const dates = getLastNDays(days);
  return dates.map(date => ({
    date,
    label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    minutes: focusSessions
      .filter(s => toDateString(s.completedAt) === date)
      .reduce((sum, s) => sum + (s.duration || 0), 0),
  }));
}

export function getActiveGoalsCount(goals) {
  return goals.filter(g => g.status !== 'completed').length;
}

export function getGoalProgress(goal) {
  if (goal.milestones && goal.milestones.length > 0) {
    const total = goal.milestones.length;
    const done = goal.milestones.filter(m => m.completed).length;
    return Math.round((done / total) * 100);
  }
  return goal.progress || 0;
}

export function getProductivityScore(tasks, habits, focusSessions, days = 7) {
  const dates = getLastNDays(days);
  return dates.map(date => {
    const tasksCompleted = getTasksCompletedOnDate(tasks, date);
    const habitsCompleted = habits.filter(h => h.completions?.includes(date)).length;
    const focusMins = focusSessions
      .filter(s => toDateString(s.completedAt) === date)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
    // Simple weighted score
    const score = (tasksCompleted * 10) + (habitsCompleted * 15) + (focusMins * 0.5);
    return {
      date,
      label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      score: Math.min(100, Math.round(score)),
    };
  });
}

export function getBestStreak(habits) {
  return habits.reduce((best, h) => Math.max(best, getCurrentStreak(h)), 0);
}
