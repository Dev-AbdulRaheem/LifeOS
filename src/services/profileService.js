import { getItem, setItem, seedIfEmpty } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateMockProfile } from '../data/mockProfile';

const DELAY = 150;
const simulate = (data) => new Promise((resolve) => setTimeout(() => resolve(data), DELAY));

export async function getProfile() {
  const profile = seedIfEmpty(STORAGE_KEYS.PROFILE, generateMockProfile);
  return simulate(profile);
}

export async function updateProfile(changes) {
  const profile = seedIfEmpty(STORAGE_KEYS.PROFILE, generateMockProfile);
  const updated = { ...profile, ...changes, updatedAt: new Date().toISOString() };
  setItem(STORAGE_KEYS.PROFILE, updated);
  return simulate(updated);
}
