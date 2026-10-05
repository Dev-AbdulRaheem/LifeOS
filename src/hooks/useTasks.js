import { useAppData } from '../context/AppDataContext';
import { getTodayString } from '../utils/dateUtils';
import { getTasksCompletedToday } from '../utils/calculations';

export function useTasks() {
  const { tasks, addTask, updateTask, deleteTask, loading } = useAppData();

  const today = getTodayString();
  const todaysTasks = tasks.filter((t) => t.dueDate === today && t.status !== 'completed');
  const completedToday = getTasksCompletedToday(tasks);
  const overdueTasks = tasks.filter((t) => t.dueDate && t.dueDate < today && t.status !== 'completed');

  return {
    tasks,
    todaysTasks,
    completedToday,
    overdueTasks,
    addTask,
    updateTask,
    deleteTask,
    loading,
  };
}
