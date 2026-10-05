import { useAppData } from '../context/AppDataContext';
import { getTodayString } from '../utils/dateUtils';

export function useEvents() {
  const { events, addEvent, updateEvent, deleteEvent, loading } = useAppData();

  const today = getTodayString();
  const todaysEvents = events
    .filter((e) => e.date === today)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const upcomingEvents = events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''));

  return {
    events,
    todaysEvents,
    upcomingEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    loading,
  };
}
