import { getItem, setItem, seedIfEmpty } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateMockTasks } from '../data/mockTasks';

const DELAY = 200;
const simulate = (data) => new Promise((resolve) => setTimeout(() => resolve(data), DELAY));

function getAll() {
  return seedIfEmpty(STORAGE_KEYS.TASKS, generateMockTasks);
}

function saveAll(tasks) {
  setItem(STORAGE_KEYS.TASKS, tasks);
}

export async function getTasks() {
  return simulate(getAll());
}

export async function createTask(data) {
  const tasks = getAll();
  const task = {
    id: crypto.randomUUID(),
    title: data.title || '',
    description: data.description || '',
    priority: data.priority || 'medium',
    category: data.category || 'Other',
    status: data.status || 'todo',
    dueDate: data.dueDate || null,
    dueTime: data.dueTime || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  };
  tasks.push(task);
  saveAll(tasks);
  return simulate(task);
}

export async function updateTask(id, changes) {
  const tasks = getAll();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Task not found');
  
  // Auto-set completedAt when marking as completed
  if (changes.status === 'completed' && tasks[index].status !== 'completed') {
    changes.completedAt = new Date().toISOString();
  }
  // Clear completedAt when un-completing
  if (changes.status && changes.status !== 'completed') {
    changes.completedAt = null;
  }
  
  tasks[index] = { ...tasks[index], ...changes, updatedAt: new Date().toISOString() };
  saveAll(tasks);
  return simulate(tasks[index]);
}

export async function deleteTask(id) {
  const tasks = getAll().filter((t) => t.id !== id);
  saveAll(tasks);
  return simulate(true);
}
