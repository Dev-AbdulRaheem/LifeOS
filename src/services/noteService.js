import { getItem, setItem, seedIfEmpty } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateMockNotes } from '../data/mockNotes';

const DELAY = 200;
const simulate = (data) => new Promise((resolve) => setTimeout(() => resolve(data), DELAY));

function getAll() {
  return seedIfEmpty(STORAGE_KEYS.NOTES, generateMockNotes);
}

function saveAll(notes) {
  setItem(STORAGE_KEYS.NOTES, notes);
}

export async function getNotes() {
  return simulate(getAll());
}

export async function createNote(data) {
  const notes = getAll();
  const note = {
    id: crypto.randomUUID(),
    title: data.title || 'Untitled Note',
    content: data.content || '',
    category: data.category || 'Personal',
    tags: data.tags || [],
    isPinned: false,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(note);
  saveAll(notes);
  return simulate(note);
}

export async function updateNote(id, changes) {
  const notes = getAll();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) throw new Error('Note not found');
  notes[index] = { ...notes[index], ...changes, updatedAt: new Date().toISOString() };
  saveAll(notes);
  return simulate(notes[index]);
}

export async function deleteNote(id) {
  const notes = getAll().filter((n) => n.id !== id);
  saveAll(notes);
  return simulate(true);
}
