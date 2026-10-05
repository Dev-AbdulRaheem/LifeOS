import { useAppData } from '../context/AppDataContext';
import { getGoalProgress, getActiveGoalsCount } from '../utils/calculations';

export function useGoals() {
  const { goals, addGoal, updateGoal, deleteGoal, loading } = useAppData();

  const activeGoals = getActiveGoalsCount(goals);
  const completedGoals = goals.filter((g) => g.status === 'completed').length;

  return {
    goals,
    activeGoals,
    completedGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalProgress,
    loading,
  };
}
