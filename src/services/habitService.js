import { getItem, setItem, seedIfEmpty } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateMockHabits } from '../data/mockHabits';

const DELAY = 200;
const simulate = (data) => new Promise((resolve) => setTimeout(() => resolve(data), DELAY));

function getAll() {
  return seedIfEmpty(STORAGE_KEYS.HABITS, generateMockHabits);
}

function saveAll(habits) {
  setItem(STORAGE_KEYS.HABITS, habits);
}

export async function getHabits() {
  return simulate(getAll());
}

export async function createHabit(data) {
  const habits = getAll();
  const habit = {
    id: crypto.randomUUID(),
    title: data.title || '',
    description: data.description || '',
    category: data.category || 'Health',
    icon: data.icon || '⭐',
    color: data.color || '#6366f1',
    completions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  habits.push(habit);
  saveAll(habits);
  return simulate(habit);
}

export async function updateHabit(id, changes) {
  const habits = getAll();
  const index = habits.findIndex((h) => h.id === id);
  if (index === -1) throw new Error('Habit not found');
  habits[index] = { ...habits[index], ...changes, updatedAt: new Date().toISOString() };
  saveAll(habits);
  return simulate(habits[index]);
}

export async function toggleHabitCompletion(id, dateStr) {
  const habits = getAll();
  const index = habits.findIndex((h) => h.id === id);
  if (index === -1) throw new Error('Habit not found');
  
  const habit = habits[index];
  const completions = [...(habit.completions || [])];
  const dateIndex = completions.indexOf(dateStr);
  
  if (dateIndex >= 0) {
    completions.splice(dateIndex, 1);
  } else {
    completions.push(dateStr);
  }
  
  habits[index] = { ...habit, completions, updatedAt: new Date().toISOString() };
  saveAll(habits);
  return simulate(habits[index]);
}

export async function deleteHabit(id) {
  const habits = getAll().filter((h) => h.id !== id);
  saveAll(habits);
  return simulate(true);
}
