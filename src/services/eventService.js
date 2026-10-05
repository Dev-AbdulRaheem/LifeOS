import { getItem, setItem, seedIfEmpty } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateMockEvents } from '../data/mockEvents';

const DELAY = 200;
const simulate = (data) => new Promise((resolve) => setTimeout(() => resolve(data), DELAY));

function getAll() {
  return seedIfEmpty(STORAGE_KEYS.EVENTS, generateMockEvents);
}

function saveAll(events) {
  setItem(STORAGE_KEYS.EVENTS, events);
}

export async function getEvents() {
  return simulate(getAll());
}

export async function createEvent(data) {
  const events = getAll();
  const event = {
    id: crypto.randomUUID(),
    title: data.title || '',
    description: data.description || '',
    date: data.date,
    time: data.time || null,
    category: data.category || 'other',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  events.push(event);
  saveAll(events);
  return simulate(event);
}

export async function updateEvent(id, changes) {
  const events = getAll();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) throw new Error('Event not found');
  events[index] = { ...events[index], ...changes, updatedAt: new Date().toISOString() };
  saveAll(events);
  return simulate(events[index]);
}

export async function deleteEvent(id) {
  const events = getAll().filter((e) => e.id !== id);
  saveAll(events);
  return simulate(true);
}
