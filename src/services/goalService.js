import { getItem, setItem, seedIfEmpty } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateMockGoals } from '../data/mockGoals';

const DELAY = 200;
const simulate = (data) => new Promise((resolve) => setTimeout(() => resolve(data), DELAY));

function getAll() {
  return seedIfEmpty(STORAGE_KEYS.GOALS, generateMockGoals);
}

function saveAll(goals) {
  setItem(STORAGE_KEYS.GOALS, goals);
}

export async function getGoals() {
  return simulate(getAll());
}

export async function createGoal(data) {
  const goals = getAll();
  const goal = {
    id: crypto.randomUUID(),
    title: data.title || '',
    description: data.description || '',
    category: data.category || 'Personal',
    priority: data.priority || 'medium',
    deadline: data.deadline || null,
    status: 'in-progress',
    progress: 0,
    milestones: (data.milestones || []).map((m) => ({
      id: crypto.randomUUID(),
      title: m.title,
      completed: false,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  goals.push(goal);
  saveAll(goals);
  return simulate(goal);
}

export async function updateGoal(id, changes) {
  const goals = getAll();
  const index = goals.findIndex((g) => g.id === id);
  if (index === -1) throw new Error('Goal not found');
  goals[index] = { ...goals[index], ...changes, updatedAt: new Date().toISOString() };
  saveAll(goals);
  return simulate(goals[index]);
}

export async function deleteGoal(id) {
  const goals = getAll().filter((g) => g.id !== id);
  saveAll(goals);
  return simulate(true);
}
