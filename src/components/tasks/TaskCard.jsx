import { CheckCircle2, Circle, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Badge from '../common/Badge';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../utils/constants';
import { getRelativeDate } from '../../utils/dateUtils';
import { useClickOutside } from '../../hooks/useClickOutside';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useClickOutside(() => setMenuOpen(false));
  const isCompleted = task.status === 'completed';
  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <div className={`group flex items-start gap-3 p-4 rounded-xl border transition-all
      ${isCompleted
        ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800'
        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-800 hover:shadow-sm'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 flex-shrink-0 transition-colors ${
          isCompleted ? 'text-green-500' : 'text-gray-300 dark:text-gray-600 hover:text-brand-500'
        }`}
        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${
          isCompleted
            ? 'text-gray-400 dark:text-gray-500 line-through'
            : 'text-gray-900 dark:text-gray-100'
        }`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'}>
            {priorityConfig?.label}
          </Badge>
          <span className="text-xs text-gray-400 dark:text-gray-500">{task.category}</span>
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Clock className="w-3 h-3" />
              {getRelativeDate(task.dueDate)}
              {task.dueTime && ` at ${task.dueTime}`}
            </span>
          )}
        </div>
      </div>

      {/* Actions menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100
            dark:hover:bg-gray-800 text-gray-400 transition-all"
          aria-label="Task actions"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-900 border
            border-gray-200 dark:border-gray-800 rounded-xl shadow-lg py-1 z-20">
            <button
              onClick={() => { onEdit(task); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700
                dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => { onDelete(task); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600
                dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
