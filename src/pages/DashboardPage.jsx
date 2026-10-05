import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Flame, Target, Timer, Plus, ArrowRight,
  Calendar, CheckSquare, StickyNote, Repeat,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import TaskModal from '../components/tasks/TaskModal';
import { useAppData } from '../context/AppDataContext';
import { useTasks } from '../hooks/useTasks';
import { useHabits } from '../hooks/useHabits';
import { useGoals } from '../hooks/useGoals';
import { useEvents } from '../hooks/useEvents';
import { useFocusSessions } from '../hooks/useFocusSessions';
import { getGreeting, formatDateShort, getRelativeDate, getTodayString } from '../utils/dateUtils';
import { getGoalProgress, getWeeklyTaskCompletion } from '../utils/calculations';
import { PRIORITY_CONFIG } from '../utils/constants';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { profile, loading, toggleHabitDay } = useAppData();
  const { tasks, todaysTasks, completedToday, updateTask } = useTasks();
  const { habits, bestStreak } = useHabits();
  const { goals, activeGoals } = useGoals();
  const { upcomingEvents } = useEvents();
  const { focusTimeToday } = useFocusSessions();
  const navigate = useNavigate();
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  if (loading) return <Spinner />;

  const today = getTodayString();
  const greeting = getGreeting();
  const weeklyData = getWeeklyTaskCompletion(tasks, 7);

  const statCards = [
    {
      label: 'Tasks Completed',
      value: completedToday,
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Best Streak',
      value: `${bestStreak} days`,
      icon: Flame,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      label: 'Active Goals',
      value: activeGoals,
      icon: Target,
      color: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-100 dark:bg-brand-900/30',
    },
    {
      label: 'Focus Today',
      value: `${focusTimeToday}m`,
      icon: Timer,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          {greeting}, {profile?.name || 'User'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" icon={Plus} onClick={() => setTaskModalOpen(true)}>Add Task</Button>
        <Button size="sm" variant="secondary" icon={Repeat} onClick={() => navigate('/habits')}>Add Habit</Button>
        <Button size="sm" variant="secondary" icon={Target} onClick={() => navigate('/goals')}>Add Goal</Button>
        <Button size="sm" variant="secondary" icon={StickyNote} onClick={() => navigate('/notes')}>Add Note</Button>
        <Button size="sm" variant="secondary" icon={Timer} onClick={() => navigate('/focus')}>Start Focus</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Tasks</h2>
            <button onClick={() => navigate('/tasks')} className="text-sm text-brand-600 dark:text-brand-400
              hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {todaysTasks.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm py-4">No tasks due today. Great job! 🎉</p>
          ) : (
            <div className="space-y-2">
              {todaysTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50
                  dark:hover:bg-gray-800/50 transition-colors">
                  <button
                    onClick={() => updateTask(task.id, { status: 'completed' })}
                    className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600
                      hover:border-brand-500 flex-shrink-0 transition-colors"
                    aria-label={`Complete ${task.title}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {task.dueTime && (
                        <span className="text-xs text-gray-400">{task.dueTime}</span>
                      )}
                      <span className="text-xs text-gray-400">{task.category}</span>
                    </div>
                  </div>
                  <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Today's Habits */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Habits</h2>
            <button onClick={() => navigate('/habits')} className="text-sm text-brand-600
              dark:text-brand-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {habits.map((habit) => {
              const completed = habit.completions?.includes(today);
              return (
                <div key={habit.id} className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHabitDay(habit.id, today)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
                      transition-colors ${
                      completed
                        ? 'bg-green-500 text-white'
                        : 'border-2 border-gray-300 dark:border-gray-600 hover:border-green-500'
                    }`}
                    aria-label={`${completed ? 'Unmark' : 'Mark'} ${habit.title}`}
                  >
                    {completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      completed
                        ? 'text-gray-400 dark:text-gray-500 line-through'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {habit.icon} {habit.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Chart */}
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Task Completion
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg, #fff)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                  }}
                />
                <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Active Goals + Upcoming Events */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Goals</h2>
              <button onClick={() => navigate('/goals')} className="text-sm text-brand-600
                dark:text-brand-400 hover:underline">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {goals.filter(g => g.status !== 'completed').slice(0, 3).map((goal) => {
                const progress = getGoalProgress(goal);
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {goal.title}
                      </p>
                      <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                        {progress}%
                      </span>
                    </div>
                    <ProgressBar value={progress} size="sm" />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
              <button onClick={() => navigate('/calendar')} className="text-sm text-brand-600
                dark:text-brand-400 hover:underline">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {upcomingEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {getRelativeDate(event.date)} {event.time && `at ${event.time}`}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-gray-400">No upcoming events</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
      />
    </div>
  );
}
