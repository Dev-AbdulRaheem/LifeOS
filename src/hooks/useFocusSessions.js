import { useAppData } from '../context/AppDataContext';
import { getFocusTimeToday } from '../utils/calculations';
import { getTodayString, toDateString } from '../utils/dateUtils';

export function useFocusSessions() {
  const { focusSessions, addFocusSession, loading } = useAppData();

  const today = getTodayString();
  const focusTimeToday = getFocusTimeToday(focusSessions);
  const sessionsToday = focusSessions.filter(
    (s) => toDateString(s.completedAt) === today
  ).length;

  return {
    focusSessions,
    focusTimeToday,
    sessionsToday,
    addFocusSession,
    loading,
  };
}
