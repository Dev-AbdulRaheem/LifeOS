import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as taskService from '../services/taskService';
import * as habitService from '../services/habitService';
import * as goalService from '../services/goalService';
import * as noteService from '../services/noteService';
import * as eventService from '../services/eventService';
import * as focusService from '../services/focusService';
import * as notificationService from '../services/notificationService';
import * as profileService from '../services/profileService';
import * as settingsService from '../services/settingsService';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  // State for all collections
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [events, setEvents] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all data on mount
  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        const [
          tasksData,
          habitsData,
          goalsData,
          notesData,
          eventsData,
          focusData,
          notifData,
          profileData,
          settingsData,
        ] = await Promise.all([
          taskService.getTasks(),
          habitService.getHabits(),
          goalService.getGoals(),
          noteService.getNotes(),
          eventService.getEvents(),
          focusService.getFocusSessions(),
          notificationService.getNotifications(),
          profileService.getProfile(),
          settingsService.getSettings(),
        ]);

        setTasks(tasksData);
        setHabits(habitsData);
        setGoals(goalsData);
        setNotes(notesData);
        setEvents(eventsData);
        setFocusSessions(focusData);
        setNotifications(notifData);
        setProfile(profileData);
        setSettings(settingsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // --- Task actions ---
  const addTask = useCallback(async (data) => {
    const task = await taskService.createTask(data);
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const updateTask = useCallback(async (id, changes) => {
    const updated = await taskService.updateTask(id, changes);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Habit actions ---
  const addHabit = useCallback(async (data) => {
    const habit = await habitService.createHabit(data);
    setHabits((prev) => [...prev, habit]);
    return habit;
  }, []);

  const updateHabit = useCallback(async (id, changes) => {
    const updated = await habitService.updateHabit(id, changes);
    setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    return updated;
  }, []);

  const toggleHabitDay = useCallback(async (id, dateStr) => {
    const updated = await habitService.toggleHabitCompletion(id, dateStr);
    setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    return updated;
  }, []);

  const deleteHabit = useCallback(async (id) => {
    await habitService.deleteHabit(id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  // --- Goal actions ---
  const addGoal = useCallback(async (data) => {
    const goal = await goalService.createGoal(data);
    setGoals((prev) => [...prev, goal]);
    return goal;
  }, []);

  const updateGoal = useCallback(async (id, changes) => {
    const updated = await goalService.updateGoal(id, changes);
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    return updated;
  }, []);

  const deleteGoal = useCallback(async (id) => {
    await goalService.deleteGoal(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  // --- Note actions ---
  const addNote = useCallback(async (data) => {
    const note = await noteService.createNote(data);
    setNotes((prev) => [...prev, note]);
    return note;
  }, []);

  const updateNote = useCallback(async (id, changes) => {
    const updated = await noteService.updateNote(id, changes);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  }, []);

  const deleteNote = useCallback(async (id) => {
    await noteService.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // --- Event actions ---
  const addEvent = useCallback(async (data) => {
    const event = await eventService.createEvent(data);
    setEvents((prev) => [...prev, event]);
    return event;
  }, []);

  const updateEvent = useCallback(async (id, changes) => {
    const updated = await eventService.updateEvent(id, changes);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  }, []);

  const deleteEvent = useCallback(async (id) => {
    await eventService.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // --- Focus session actions ---
  const addFocusSession = useCallback(async (data) => {
    const session = await focusService.createFocusSession(data);
    setFocusSessions((prev) => [...prev, session]);
    return session;
  }, []);

  // --- Notification actions ---
  const addNotification = useCallback(async (data) => {
    const notif = await notificationService.createNotification(data);
    setNotifications((prev) => [notif, ...prev]);
    return notif;
  }, []);

  const markNotificationRead = useCallback(async (id) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback(async (id) => {
    await notificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // --- Profile actions ---
  const updateProfile = useCallback(async (changes) => {
    const updated = await profileService.updateProfile(changes);
    setProfile(updated);
    return updated;
  }, []);

  // --- Settings actions ---
  const updateSettings = useCallback(async (changes) => {
    const updated = await settingsService.updateSettings(changes);
    setSettings(updated);
    return updated;
  }, []);

  // Reload all data (e.g., after import)
  const reloadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [
        tasksData, habitsData, goalsData, notesData,
        eventsData, focusData, notifData, profileData, settingsData,
      ] = await Promise.all([
        taskService.getTasks(),
        habitService.getHabits(),
        goalService.getGoals(),
        noteService.getNotes(),
        eventService.getEvents(),
        focusService.getFocusSessions(),
        notificationService.getNotifications(),
        profileService.getProfile(),
        settingsService.getSettings(),
      ]);
      setTasks(tasksData);
      setHabits(habitsData);
      setGoals(goalsData);
      setNotes(notesData);
      setEvents(eventsData);
      setFocusSessions(focusData);
      setNotifications(notifData);
      setProfile(profileData);
      setSettings(settingsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    // Data
    tasks, habits, goals, notes, events, focusSessions, notifications, profile, settings,
    loading, error,
    // Task actions
    addTask, updateTask, deleteTask,
    // Habit actions
    addHabit, updateHabit, toggleHabitDay, deleteHabit,
    // Goal actions
    addGoal, updateGoal, deleteGoal,
    // Note actions
    addNote, updateNote, deleteNote,
    // Event actions
    addEvent, updateEvent, deleteEvent,
    // Focus actions
    addFocusSession,
    // Notification actions
    addNotification, markNotificationRead, markAllNotificationsRead, deleteNotification,
    // Profile/Settings
    updateProfile, updateSettings,
    // Reload
    reloadAll,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within AppDataProvider');
  return context;
}
