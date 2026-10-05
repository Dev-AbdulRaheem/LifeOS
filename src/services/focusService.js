import { getItem, setItem, seedIfEmpty } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateMockFocusSessions } from '../data/mockFocusSessions';

const DELAY = 200;
const simulate = (data) => new Promise((resolve) => setTimeout(() => resolve(data), DELAY));

function getAll() {
  return seedIfEmpty(STORAGE_KEYS.FOCUS_SESSIONS, generateMockFocusSessions);
}

function saveAll(sessions) {
  setItem(STORAGE_KEYS.FOCUS_SESSIONS, sessions);
}

export async function getFocusSessions() {
  return simulate(getAll());
}

export async function createFocusSession(data) {
  const sessions = getAll();
  const session = {
    id: crypto.randomUUID(),
    duration: data.duration,
    type: data.type || 'focus',
    taskId: data.taskId || null,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  sessions.push(session);
  saveAll(sessions);
  return simulate(session);
}

export async function deleteFocusSession(id) {
  const sessions = getAll().filter((s) => s.id !== id);
  saveAll(sessions);
  return simulate(true);
}
