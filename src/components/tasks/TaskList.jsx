import { AnimatePresence, motion } from 'framer-motion';
import TaskCard from './TaskCard';
import EmptyState from '../common/EmptyState';
import { CheckSquare } from 'lucide-react';

export default function TaskList({ tasks, onToggle, onEdit, onDelete, onCreateNew }) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="No tasks found"
        description="Create your first task to get started"
        actionLabel="+ Create Task"
        onAction={onCreateNew}
      />
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <TaskCard
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
