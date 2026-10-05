import { useState } from 'react';
import Card from '../components/common/Card';
import Tabs from '../components/common/Tabs';
import Spinner from '../components/common/Spinner';
import { useAppData } from '../context/AppDataContext';
import {
  getWeeklyTaskCompletion,
  getHabitConsistencyData,
  getFocusTimeByDay,
  getProductivityScore,
} from '../utils/calculations';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export default function AnalyticsPage() {
  const { tasks, habits, focusSessions, loading } = useAppData();
  const [rangeDays, setRangeDays] = useState(7); // 7 or 30

  if (loading) return <Spinner />;

  const taskData = getWeeklyTaskCompletion(tasks, rangeDays);
  const habitData = getHabitConsistencyData(habits, rangeDays);
  const focusData = getFocusTimeByDay(focusSessions, rangeDays);
  const productivityData = getProductivityScore(tasks, habits, focusSessions, rangeDays);

  const totalTasks = taskData.reduce((acc, curr) => acc + curr.completed, 0);
  const totalFocus = focusData.reduce((acc, curr) => acc + curr.minutes, 0);
  const avgRate = Math.round(habitData.reduce((acc, curr) => acc + curr.rate, 0) / habitData.length || 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Insights into your productivity, focus, and habit habits</p>
        </div>
        <Tabs
          tabs={[
            { value: 7, label: 'Last 7 Days' },
            { value: 30, label: 'Last 30 Days' },
          ]}
          activeTab={rangeDays}
          onChange={setRangeDays}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed Tasks</p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{totalTasks}</p>
          <p className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-medium">in past {rangeDays} days</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Habit Rate</p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{avgRate}%</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">consistency score</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Focus Time</p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{totalFocus} mins</p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">logged in deep work</p>
        </Card>
      </div>

      {/* Productivity Score Trend */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Overall Productivity Score Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Side-by-side charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Consistency */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Habit Consistency (%)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={habitData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Focus Minutes */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Focus Time (Minutes)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="minutes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
