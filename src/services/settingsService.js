import { getItem, setItem, seedIfEmpty } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateMockSettings } from '../data/mockSettings';

const DELAY = 150;
const simulate = (data) => new Promise((resolve) => setTimeout(() => resolve(data), DELAY));

export async function getSettings() {
  const settings = seedIfEmpty(STORAGE_KEYS.SETTINGS, generateMockSettings);
  return simulate(settings);
}

export async function updateSettings(changes) {
  const settings = seedIfEmpty(STORAGE_KEYS.SETTINGS, generateMockSettings);
  const updated = deepMerge(settings, changes);
  updated.updatedAt = new Date().toISOString();
  setItem(STORAGE_KEYS.SETTINGS, updated);
  return simulate(updated);
}

// Deep merge for nested settings objects
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
