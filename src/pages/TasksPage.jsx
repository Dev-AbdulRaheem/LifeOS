import { useState, useMemo } from 'react';
import { Plus, LayoutList, LayoutGrid } from 'lucide-react';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import TaskList from '../components/tasks/TaskList';
import TaskBoard from '../components/tasks/TaskBoard';
import TaskFilter from '../components/tasks/TaskFilter';
import TaskModal from '../components/tasks/TaskModal';
import TaskStats from '../components/tasks/TaskStats';
import { useTasks } from '../hooks/useTasks';

const priorityOrder = { high: 0, medium: 1, low: 2 };

export default function TasksPage() {
  const { tasks, updateTask, deleteTask, loading } = useTasks();
  const [view, setView] = useState('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    sort: 'dueDate',
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    await updateTask(id, { status: newStatus });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (deletingTask) {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  // Filter, search, and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }

    // Filters
    if (filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.priority !== 'all') {
      result = result.filter((t) => t.priority === filters.priority);
    }
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'priority':
          return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dueDate':
        default:
          return (a.dueDate || '9999') .localeCompare(b.dueDate || '9999');
      }
    });

    return result;
  }, [tasks, searchQuery, filters]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track your tasks</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-colors ${
                view === 'list'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="List view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('board')}
              className={`p-2 rounded-md transition-colors ${
                view === 'board'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Board view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <Button icon={Plus} onClick={() => { setEditingTask(null); setModalOpen(true); }}>
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <TaskStats tasks={tasks} />

      {/* Filters */}
      <TaskFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Task View */}
      {view === 'list' ? (
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={(task) => setDeletingTask(task)}
          onCreateNew={() => { setEditingTask(null); setModalOpen(true); }}
        />
      ) : (
        <TaskBoard
          tasks={filteredTasks}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={(task) => setDeletingTask(task)}
        />
      )}

      {/* Modals */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        task={editingTask}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This cannot be undone.`}
      />
    </div>
  );
}
