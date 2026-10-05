import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { getItem, setItem } from '../utils/storage';

const ThemeContext = createContext(null);

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [themeSetting, setThemeSetting] = useState(() => {
    return getItem(STORAGE_KEYS.THEME) || 'system';
  });

  // The actual resolved theme (always 'light' or 'dark')
  const resolvedTheme = themeSetting === 'system' ? getSystemTheme() : themeSetting;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (themeSetting !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setThemeSetting('system'); // triggers re-render
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themeSetting]);

  const setTheme = useCallback((theme) => {
    setThemeSetting(theme);
    setItem(STORAGE_KEYS.THEME, theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: themeSetting, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
