import { useEffect } from 'react';

export function useKeyboardShortcut(key, callback, options = {}) {
  const { ctrlKey = false, metaKey = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    function handler(event) {
      const modifierMatch =
        (!ctrlKey && !metaKey) ||
        (ctrlKey && event.ctrlKey) ||
        (metaKey && event.metaKey);

      if (event.key === key && modifierMatch) {
        event.preventDefault();
        callback(event);
      }
    }

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [key, callback, ctrlKey, metaKey, enabled]);
}
