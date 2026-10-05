import { getItem, setItem, seedIfEmpty } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateMockNotifications } from '../data/mockNotifications';

const DELAY = 150;
const simulate = (data) => new Promise((resolve) => setTimeout(() => resolve(data), DELAY));

function getAll() {
  return seedIfEmpty(STORAGE_KEYS.NOTIFICATIONS, generateMockNotifications);
}

function saveAll(notifications) {
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

export async function getNotifications() {
  return simulate(getAll());
}

export async function createNotification(data) {
  const notifications = getAll();
  const notification = {
    id: crypto.randomUUID(),
    type: data.type || 'info',
    title: data.title || '',
    message: data.message || '',
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(notification);
  saveAll(notifications);
  return simulate(notification);
}

export async function markAsRead(id) {
  const notifications = getAll();
  const index = notifications.findIndex((n) => n.id === id);
  if (index !== -1) {
    notifications[index] = { ...notifications[index], read: true };
    saveAll(notifications);
  }
  return simulate(true);
}

export async function markAllAsRead() {
  const notifications = getAll().map((n) => ({ ...n, read: true }));
  saveAll(notifications);
  return simulate(true);
}

export async function deleteNotification(id) {
  const notifications = getAll().filter((n) => n.id !== id);
  saveAll(notifications);
  return simulate(true);
}
