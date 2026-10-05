import { STORAGE_KEYS } from './constants';

// Safe localStorage wrapper with JSON parsing and namespaced keys

export function getItem(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch {
    // If JSON parse fails, remove corrupted data and return null
    localStorage.removeItem(key);
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to save to localStorage key "${key}":`, error);
    return false;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}":`, error);
    return false;
  }
}

// Initialize a storage key with seed data if it doesn't exist yet
export function seedIfEmpty(key, seedDataFn) {
  const existing = getItem(key);
  if (existing === null) {
    const data = typeof seedDataFn === 'function' ? seedDataFn() : seedDataFn;
    setItem(key, data);
    return data;
  }
  return existing;
}

// Clear all LifeOS data from localStorage
export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    removeItem(key);
  });
}

// Export all LifeOS data as a single object
export function exportAllData() {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = getItem(key);
  });
  return data;
}

// Import data from a JSON object, validating structure
export function importAllData(data) {
  const errors = [];
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    if (data[name] !== undefined) {
      const success = setItem(key, data[name]);
      if (!success) errors.push(`Failed to import ${name}`);
    }
  });
  return errors;
}
