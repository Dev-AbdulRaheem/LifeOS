import { TASK_STATUS, STATUS_CONFIG } from '../../utils/constants';
import TaskCard from './TaskCard';

const columns = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

export default function TaskBoard({ tasks, onToggle, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div key={col.key} className="flex-shrink-0 w-80 lg:flex-1">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className={`w-2 h-2 rounded-full ${
                col.key === 'todo' ? 'bg-gray-400' :
                col.key === 'in-progress' ? 'bg-brand-500' : 'bg-green-500'
              }`} />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {col.label}
              </h3>
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5
                rounded-full">
                {columnTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2 min-h-[200px] p-2 rounded-xl bg-gray-50 dark:bg-gray-800/30">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
              {columnTasks.length === 0 && (
                <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
                  No tasks
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
