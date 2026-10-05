import { useAppData } from '../context/AppDataContext';
import { getCurrentStreak, getLongestStreak, getHabitCompletionRate, getBestStreak } from '../utils/calculations';
import { getTodayString } from '../utils/dateUtils';

export function useHabits() {
  const { habits, addHabit, updateHabit, toggleHabitDay, deleteHabit, loading } = useAppData();

  const today = getTodayString();
  const bestStreak = getBestStreak(habits);
  const completedToday = habits.filter(
    (h) => h.completions && h.completions.includes(today)
  ).length;

  return {
    habits,
    bestStreak,
    completedToday,
    totalHabits: habits.length,
    addHabit,
    updateHabit,
    toggleHabitDay,
    deleteHabit,
    getCurrentStreak,
    getLongestStreak,
    getHabitCompletionRate,
    loading,
  };
}
