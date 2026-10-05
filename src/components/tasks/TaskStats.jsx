import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';

export default function TaskStats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const overdue = tasks.filter((t) => t.dueDate && t.dueDate < new Date().toISOString().slice(0, 10) && t.status !== 'completed').length;

  const stats = [
    { label: 'Total', value: total, icon: ListTodo, color: 'text-gray-600 dark:text-gray-400' },
    { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-green-600 dark:text-green-400' },
    { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-brand-600 dark:text-brand-400' },
    { label: 'Overdue', value: overdue, icon: AlertTriangle, color: 'text-red-600 dark:text-red-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl bg-white
          dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <stat.icon className={`w-5 h-5 ${stat.color}`} />
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
