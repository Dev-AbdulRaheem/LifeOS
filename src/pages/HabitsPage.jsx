import { useState } from 'react';
import { Plus, Flame, Check, Trash2, Award } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import { useHabits } from '../hooks/useHabits';
import { getLastNDays, getTodayString, getDayNameShort } from '../utils/dateUtils';
import { HABIT_CATEGORIES } from '../utils/constants';

const categoryOptions = HABIT_CATEGORIES.map(c => ({ value: c, label: c }));

export default function HabitsPage() {
  const {
    habits,
    loading,
    addHabit,
    deleteHabit,
    toggleHabitDay,
    getCurrentStreak,
    getLongestStreak,
    getHabitCompletionRate,
  } = useHabits();

  const [modalOpen, setModalOpen] = useState(false);
  const [deletingHabit, setDeletingHabit] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Health',
    icon: '⚡',
    color: '#6366f1',
  });

  const last7Days = getLastNDays(7);
  const today = getTodayString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await addHabit(form);
    setForm({ title: '', description: '', category: 'Health', icon: '⚡', color: '#6366f1' });
    setModalOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Habits</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Build streaks and track daily consistency</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>Add Habit</Button>
      </div>

      {/* Week Header */}
      <div className="hidden sm:flex justify-end gap-2 pr-6 text-xs text-gray-400 font-medium">
        <span className="w-24 text-right mr-4">Last 7 Days:</span>
        {last7Days.map(date => (
          <span key={date} className={`w-8 text-center ${date === today ? 'text-brand-600 font-bold' : ''}`}>
            {getDayNameShort(new Date(date).getDay())}
          </span>
        ))}
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="No habits tracked yet"
          description="Consistent habits compound over time. Add your first habit today!"
          actionLabel="+ Add Habit"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => {
            const streak = getCurrentStreak(habit);
            const longest = getLongestStreak(habit);
            const rate = getHabitCompletionRate(habit);

            return (
              <Card key={habit.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                    {habit.icon || '🎯'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">{habit.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center gap-1 text-orange-500 font-medium">
                        <Flame className="w-3.5 h-3.5 fill-current" /> {streak} day streak
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-gray-400" /> Best: {longest}d
                      </span>
                      <span>•</span>
                      <span>{rate}% 30-day rate</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    {last7Days.map((date) => {
                      const isDone = habit.completions?.includes(date);
                      return (
                        <button
                          key={date}
                          onClick={() => toggleHabitDay(habit.id, date)}
                          title={`${habit.title} on ${date}: ${isDone ? 'Done' : 'Incomplete'}`}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-transparent'
                          } ${date === today ? 'ring-2 ring-brand-500 ring-offset-1 dark:ring-offset-gray-900' : ''}`}
                        >
                          <Check className={`w-4 h-4 stroke-[3] ${isDone ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setDeletingHabit(habit)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-2"
                    aria-label="Delete habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Habit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Habit">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Habit Name"
            placeholder="e.g. Read 20 pages, 30 min cardio"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            autoFocus
          />
          <Input
            label="Description (optional)"
            placeholder="Brief motivation or details"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Input
              label="Icon (Emoji)"
              placeholder="e.g. 🏋️, 📚, 💧"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Habit</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingHabit}
        onClose={() => setDeletingHabit(null)}
        onConfirm={() => deleteHabit(deletingHabit.id)}
        title="Delete Habit"
        message={`Are you sure you want to delete "${deletingHabit?.title}"? All streak records will be lost.`}
      />
    </div>
  );
}
