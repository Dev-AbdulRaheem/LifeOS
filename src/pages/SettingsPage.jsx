import { useState } from 'react';
import { Settings, Moon, Bell, Clock, Database, Download, Upload, RefreshCw, CheckCircle2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Spinner from '../components/common/Spinner';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../context/ThemeContext';
import { exportAllData, importAllData, clearAllData } from '../utils/storage';

export default function SettingsPage() {
  const { settings, updateSettings, reloadAll, loading } = useAppData();
  const { theme, setTheme } = useTheme();

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [savedStatus, setSavedStatus] = useState(false);

  if (loading) return <Spinner />;

  const handleFocusChange = (field, val) => {
    updateSettings({
      focus: {
        ...(settings?.focus || {}),
        [field]: parseInt(val, 10) || 1,
      },
    });
  };

  const handleTaskPrefChange = (field, val) => {
    updateSettings({
      tasks: {
        ...(settings?.tasks || {}),
        [field]: val,
      },
    });
  };

  const handleNotificationToggle = (field) => {
    updateSettings({
      notifications: {
        ...(settings?.notifications || {}),
        [field]: !settings?.notifications?.[field],
      },
    });
  };

  // Export JSON
  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const errors = importAllData(json);
        if (errors.length > 0) {
          setImportStatus({ success: false, message: errors.join(', ') });
        } else {
          await reloadAll();
          setImportStatus({ success: true, message: 'All data imported successfully!' });
        }
      } catch (err) {
        setImportStatus({ success: false, message: 'Invalid JSON backup file' });
      }
    };
    reader.readAsText(file);
  };

  // Reset to seed
  const handleReset = async () => {
    clearAllData();
    await reloadAll();
    setResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Preferences, timer customizations, and data management</p>
      </div>

      {/* Appearance */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5 text-brand-600 dark:text-brand-400" /> Appearance
        </h2>
        <div className="max-w-xs">
          <Select
            label="Theme Preference"
            options={[
              { value: 'system', label: 'System Default' },
              { value: 'light', label: 'Light Mode' },
              { value: 'dark', label: 'Dark Mode' },
            ]}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </div>
      </Card>

      {/* Focus Timer Settings */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" /> Focus Durations (Minutes)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Focus Session"
            type="number"
            min="1"
            max="120"
            value={settings?.focus?.focusDuration || 25}
            onChange={(e) => handleFocusChange('focusDuration', e.target.value)}
          />
          <Input
            label="Short Break"
            type="number"
            min="1"
            max="30"
            value={settings?.focus?.shortBreakDuration || 5}
            onChange={(e) => handleFocusChange('shortBreakDuration', e.target.value)}
          />
          <Input
            label="Long Break"
            type="number"
            min="1"
            max="60"
            value={settings?.focus?.longBreakDuration || 15}
            onChange={(e) => handleFocusChange('longBreakDuration', e.target.value)}
          />
        </div>
      </Card>

      {/* Task Defaults */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Task Preferences</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Default Priority"
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            value={settings?.tasks?.defaultPriority || 'medium'}
            onChange={(e) => handleTaskPrefChange('defaultPriority', e.target.value)}
          />
          <Select
            label="Default View"
            options={[
              { value: 'list', label: 'List' },
              { value: 'board', label: 'Board (Kanban)' },
            ]}
            value={settings?.tasks?.defaultView || 'list'}
            onChange={(e) => handleTaskPrefChange('defaultView', e.target.value)}
          />
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-600 dark:text-brand-400" /> Notification Alerts
        </h2>
        <div className="space-y-3">
          {[
            { key: 'taskReminders', label: 'Task Reminders' },
            { key: 'habitReminders', label: 'Habit Streak Alerts' },
            { key: 'focusAlerts', label: 'Focus Session Alerts' },
            { key: 'goalMilestones', label: 'Goal Milestone Notifications' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!settings?.notifications?.[key]}
                onChange={() => handleNotificationToggle(key)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-600 dark:text-brand-400" /> Data Management
        </h2>
        <p className="text-xs text-gray-400 mb-6">Backup all your life records to JSON or restore from an existing file</p>

        {importStatus && (
          <div className={`p-3 rounded-lg text-sm mb-4 ${importStatus.success ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {importStatus.message}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={handleExport}>
            Export Backup (JSON)
          </Button>

          <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer text-sm font-medium px-4 py-2 rounded-lg">
            <Upload className="w-4 h-4" /> Import Backup
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>

          <Button variant="danger" icon={RefreshCw} onClick={() => setResetConfirmOpen(true)}>
            Reset to Seed Data
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleReset}
        title="Reset All Data"
        message="Are you sure you want to reset all tasks, habits, goals, notes, and calendar events to the default seed data? This cannot be reversed."
        confirmLabel="Reset Everything"
      />
    </div>
  );
}
