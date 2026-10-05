import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, CheckCircle2, Clock, Flame } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import { useTimer } from '../hooks/useTimer';
import { useFocusSessions } from '../hooks/useFocusSessions';
import { useTasks } from '../hooks/useTasks';
import { useAppData } from '../context/AppDataContext';
import { formatTimerDisplay, formatDuration } from '../utils/dateUtils';
import { DEFAULT_FOCUS_DURATIONS, FOCUS_MODES } from '../utils/constants';

export default function FocusPage() {
  const { settings, addNotification } = useAppData();
  const { focusSessions, focusTimeToday, sessionsToday, addFocusSession } = useFocusSessions();
  const { tasks } = useTasks();

  const [mode, setMode] = useState(FOCUS_MODES.FOCUS);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [sessionCount, setSessionCount] = useState(0);

  const durationMinutes =
    mode === FOCUS_MODES.FOCUS
      ? (settings?.focus?.focusDuration || DEFAULT_FOCUS_DURATIONS.focus)
      : mode === FOCUS_MODES.SHORT_BREAK
      ? (settings?.focus?.shortBreakDuration || DEFAULT_FOCUS_DURATIONS['short-break'])
      : (settings?.focus?.longBreakDuration || DEFAULT_FOCUS_DURATIONS['long-break']);

  const {
    remainingSeconds,
    status,
    start,
    pause,
    resume,
    reset,
    isRunning,
    isPaused,
    isCompleted,
  } = useTimer(durationMinutes);

  // Switch modes and reset timer
  const switchMode = (newMode) => {
    setMode(newMode);
    const newMins =
      newMode === FOCUS_MODES.FOCUS
        ? (settings?.focus?.focusDuration || DEFAULT_FOCUS_DURATIONS.focus)
        : newMode === FOCUS_MODES.SHORT_BREAK
        ? (settings?.focus?.shortBreakDuration || DEFAULT_FOCUS_DURATIONS['short-break'])
        : (settings?.focus?.longBreakDuration || DEFAULT_FOCUS_DURATIONS['long-break']);
    reset(newMins);
  };

  // When timer completes naturally
  useEffect(() => {
    if (isCompleted) {
      if (mode === FOCUS_MODES.FOCUS) {
        addFocusSession({
          duration: durationMinutes,
          type: 'focus',
          taskId: selectedTaskId || null,
        });
        addNotification({
          type: 'focus',
          title: 'Session Complete! 🎉',
          message: `Great job! You finished a ${durationMinutes}-minute focus block.`,
        });
        const newCount = sessionCount + 1;
        setSessionCount(newCount);
        if (newCount % 4 === 0) {
          switchMode(FOCUS_MODES.LONG_BREAK);
        } else {
          switchMode(FOCUS_MODES.SHORT_BREAK);
        }
      } else {
        addNotification({
          type: 'focus',
          title: 'Break Finished',
          message: 'Ready to dive back into deep work?',
        });
        switchMode(FOCUS_MODES.FOCUS);
      }
    }
  }, [isCompleted]);

  const activeTasks = tasks.filter(t => t.status !== 'completed').map(t => ({
    value: t.id,
    label: t.title,
  }));

  const totalSeconds = durationMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Focus Timer</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Pomodoro technique for distraction-free deep work</p>
      </div>

      {/* Main Timer Card */}
      <Card className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
        {/* Mode Selector Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl gap-1 mb-8">
          <button
            onClick={() => switchMode(FOCUS_MODES.FOCUS)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === FOCUS_MODES.FOCUS
                ? 'bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Focus ({settings?.focus?.focusDuration || 25}m)
          </button>
          <button
            onClick={() => switchMode(FOCUS_MODES.SHORT_BREAK)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === FOCUS_MODES.SHORT_BREAK
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Short Break ({settings?.focus?.shortBreakDuration || 5}m)
          </button>
          <button
            onClick={() => switchMode(FOCUS_MODES.LONG_BREAK)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === FOCUS_MODES.LONG_BREAK
                ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Long Break ({settings?.focus?.longBreakDuration || 15}m)
          </button>
        </div>

        {/* Big Ring Display */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-gray-100 dark:text-gray-800 stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`${
                mode === FOCUS_MODES.FOCUS
                  ? 'text-brand-600 dark:text-brand-500'
                  : mode === FOCUS_MODES.SHORT_BREAK
                  ? 'text-emerald-500'
                  : 'text-purple-500'
              } stroke-current transition-all duration-300 ease-linear`}
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (progressPercent / 100) * 276.46}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight font-mono">
              {formatTimerDisplay(remainingSeconds)}
            </span>
            <span className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-semibold">
              {mode.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Task linking */}
        {mode === FOCUS_MODES.FOCUS && (
          <div className="w-full max-w-sm mb-6">
            <Select
              label=""
              options={[{ value: '', label: 'Select task to focus on (optional)' }, ...activeTasks]}
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            icon={RotateCcw}
            onClick={() => reset(durationMinutes)}
            title="Reset timer"
          >
            Reset
          </Button>

          {!isRunning ? (
            <Button
              size="lg"
              icon={Play}
              className="px-8 text-base shadow-lg shadow-brand-500/20"
              onClick={status === 'paused' ? resume : start}
            >
              {status === 'paused' ? 'Resume' : 'Start Focus'}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="secondary"
              icon={Pause}
              className="px-8 text-base"
              onClick={pause}
            >
              Pause
            </Button>
          )}

          <Button
            variant="secondary"
            icon={SkipForward}
            onClick={() => {
              if (mode === FOCUS_MODES.FOCUS) switchMode(FOCUS_MODES.SHORT_BREAK);
              else switchMode(FOCUS_MODES.FOCUS);
            }}
            title="Skip to next session"
          >
            Skip
          </Button>
        </div>
      </Card>

      {/* Today Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{focusTimeToday} mins</p>
            <p className="text-xs text-gray-400 font-medium">Focused Today</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{sessionsToday} sessions</p>
            <p className="text-xs text-gray-400 font-medium">Completed Today</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
