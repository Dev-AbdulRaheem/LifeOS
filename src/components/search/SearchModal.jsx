import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CheckSquare, Repeat, Target, StickyNote, Calendar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppData } from '../../context/AppDataContext';
import { useDebounce } from '../../hooks/useDebounce';

const typeConfig = {
  task: { icon: CheckSquare, label: 'Tasks', route: '/tasks' },
  habit: { icon: Repeat, label: 'Habits', route: '/habits' },
  goal: { icon: Target, label: 'Goals', route: '/goals' },
  note: { icon: StickyNote, label: 'Notes', route: '/notes' },
  event: { icon: Calendar, label: 'Events', route: '/calendar' },
};

export default function SearchModal({ isOpen, onClose }) {
  const { tasks, habits, goals, notes, events } = useAppData();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Search across all collections
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    const matches = [];

    tasks.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)) {
        matches.push({ ...t, type: 'task' });
      }
    });
    habits.forEach((h) => {
      if (h.title.toLowerCase().includes(q)) {
        matches.push({ ...h, type: 'habit' });
      }
    });
    goals.forEach((g) => {
      if (g.title.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q)) {
        matches.push({ ...g, type: 'goal' });
      }
    });
    notes.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)) {
        matches.push({ ...n, type: 'note' });
      }
    });
    events.forEach((e) => {
      if (e.title.toLowerCase().includes(q)) {
        matches.push({ ...e, type: 'event' });
      }
    });

    return matches.slice(0, 20);
  }, [debouncedQuery, tasks, habits, goals, notes, events]);

  const handleSelect = useCallback((result) => {
    const config = typeConfig[result.type];
    navigate(`${config.route}?highlight=${result.id}`);
    onClose();
  }, [navigate, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelect, onClose]);

  // Group results by type
  const grouped = useMemo(() => {
    const groups = {};
    results.forEach((r) => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    });
    return groups;
  }, [results]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl
              shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                placeholder="Search tasks, habits, goals, notes, events..."
                className="flex-1 py-4 bg-transparent text-gray-900 dark:text-gray-100
                  placeholder-gray-400 focus:outline-none text-base"
              />
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close search"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {debouncedQuery && results.length === 0 && (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                  No results found for "{debouncedQuery}"
                </div>
              )}

              {Object.entries(grouped).map(([type, items]) => {
                const config = typeConfig[type];
                const Icon = config.icon;
                return (
                  <div key={type}>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400
                      uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                      {config.label}
                    </div>
                    {items.map((item) => {
                      flatIndex++;
                      const idx = flatIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left
                            transition-colors text-sm
                            ${idx === selectedIndex
                              ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}

              {!debouncedQuery && (
                <div className="py-12 text-center text-gray-400 dark:text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Type to search across everything</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
