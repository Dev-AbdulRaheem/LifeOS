import { useState } from 'react';
import { Plus, Target, CheckCircle2, Circle, Trash2, Calendar, Flag } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import { useGoals } from '../hooks/useGoals';
import { GOAL_CATEGORIES, PRIORITY_CONFIG } from '../utils/constants';
import { formatDateShort, getTodayString } from '../utils/dateUtils';

const categoryOptions = GOAL_CATEGORIES.map(c => ({ value: c, label: c }));
const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function GoalsPage() {
  const { goals, loading, addGoal, updateGoal, deleteGoal, getGoalProgress } = useGoals();
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingGoal, setDeletingGoal] = useState(null);
  const [newMilestoneText, setNewMilestoneText] = useState({});
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Career',
    priority: 'high',
    deadline: getTodayString(),
    milestones: [],
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await addGoal(form);
    setForm({
      title: '',
      description: '',
      category: 'Career',
      priority: 'high',
      deadline: getTodayString(),
      milestones: [],
    });
    setModalOpen(false);
  };

  const handleToggleMilestone = async (goal, milestoneId) => {
    const updatedMilestones = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const allDone = updatedMilestones.length > 0 && updatedMilestones.every(m => m.completed);
    await updateGoal(goal.id, {
      milestones: updatedMilestones,
      status: allDone ? 'completed' : 'in-progress',
    });
  };

  const handleAddMilestone = async (goal) => {
    const text = newMilestoneText[goal.id];
    if (!text || !text.trim()) return;
    const newM = { id: crypto.randomUUID(), title: text.trim(), completed: false };
    const updatedMilestones = [...(goal.milestones || []), newM];
    await updateGoal(goal.id, { milestones: updatedMilestones });
    setNewMilestoneText(prev => ({ ...prev, [goal.id]: '' }));
  };

  const handleDeleteMilestone = async (goal, milestoneId) => {
    const updatedMilestones = goal.milestones.filter(m => m.id !== milestoneId);
    await updateGoal(goal.id, { milestones: updatedMilestones });
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Goals</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track ambitious milestones and long-term targets</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>New Goal</Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals set yet"
          description="Define a major goal and break it down into actionable milestones."
          actionLabel="+ Create Goal"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = getGoalProgress(goal);
            const isCompleted = goal.status === 'completed' || progress === 100;
            const priorityConfig = PRIORITY_CONFIG[goal.priority] || PRIORITY_CONFIG.medium;

            return (
              <Card key={goal.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={goal.priority === 'high' ? 'danger' : goal.priority === 'medium' ? 'warning' : 'default'}>
                          {priorityConfig.label}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{goal.category}</span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{goal.title}</h2>
                    </div>
                    <button
                      onClick={() => setDeletingGoal(goal)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                      aria-label="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{goal.description}</p>
                  )}

                  {/* Progress bar */}
                  <div className="mb-6 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="text-brand-600 dark:text-brand-400">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Milestones</h3>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {(goal.milestones || []).map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <button
                            onClick={() => handleToggleMilestone(goal, m.id)}
                            className="flex items-center gap-2 text-left flex-1 min-w-0"
                          >
                            {m.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className={`truncate text-sm ${m.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                              {m.title}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(goal, m.id)}
                            className="text-gray-300 hover:text-red-400 p-1 opacity-0 hover:opacity-100 transition-opacity"
                            aria-label="Delete milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Quick add milestone input */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Add a milestone..."
                        value={newMilestoneText[goal.id] || ''}
                        onChange={(e) => setNewMilestoneText({ ...newMilestoneText, [goal.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone(goal)}
                        className="input-field text-xs py-1.5 flex-1"
                      />
                      <Button size="sm" variant="secondary" onClick={() => handleAddMilestone(goal)}>Add</Button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                {goal.deadline && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Target deadline: {formatDateShort(goal.deadline)}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Goal">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Goal Title"
            placeholder="e.g. Become Full Stack Developer"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            autoFocus
          />
          <Textarea
            label="Description"
            placeholder="Why is this goal important? What is the outcome?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Select
              label="Priority"
              options={priorityOptions}
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            />
          </div>
          <Input
            label="Target Deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Goal</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingGoal}
        onClose={() => setDeletingGoal(null)}
        onConfirm={() => deleteGoal(deletingGoal.id)}
        title="Delete Goal"
        message={`Are you sure you want to delete "${deletingGoal?.title}"? All milestones will be removed.`}
      />
    </div>
  );
}
