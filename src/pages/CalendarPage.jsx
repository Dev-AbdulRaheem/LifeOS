import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Spinner from '../components/common/Spinner';
import { useEvents } from '../hooks/useEvents';
import { EVENT_CATEGORIES } from '../utils/constants';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  getTodayString,
  toDateString,
  formatDate,
} from '../utils/dateUtils';

const categoryOptions = Object.entries(EVENT_CATEGORIES).map(([key, config]) => ({
  value: key,
  label: config.label,
}));

export default function CalendarPage() {
  const { events, loading, addEvent, deleteEvent } = useEvents();
  const today = getTodayString();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: today,
    time: '12:00',
    category: 'meeting',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const jumpToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(today);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await addEvent(form);
    setForm({ title: '', description: '', date: selectedDate, time: '12:00', category: 'meeting' });
    setModalOpen(false);
  };

  const selectedDateEvents = events.filter((e) => e.date === selectedDate);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Schedule meetings, deadlines, and personal events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={jumpToday}>Today</Button>
          <Button icon={Plus} onClick={() => { setForm(prev => ({ ...prev, date: selectedDate })); setModalOpen(true); }}>
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Grid */}
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {getMonthName(month)} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-gray-400 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <span key={d} className="py-1">{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-lg bg-gray-50/50 dark:bg-gray-800/10" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = toDateString(new Date(year, month, dayNum));
              const dayEvents = events.filter(e => e.date === dateStr);
              const isSelected = dateStr === selectedDate;
              const isCurrentDay = dateStr === today;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-20 sm:h-24 p-1.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-900/20'
                      : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                        isCurrentDay
                          ? 'bg-brand-600 text-white font-bold'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] text-gray-400 font-medium sm:hidden">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Desktop Preview Pills */}
                  <div className="hidden sm:flex flex-col gap-1 overflow-hidden w-full">
                    {dayEvents.slice(0, 2).map(ev => {
                      const color = EVENT_CATEGORIES[ev.category]?.color || 'bg-gray-400';
                      return (
                        <div
                          key={ev.id}
                          className="text-[10px] truncate px-1.5 py-0.5 rounded text-white font-medium flex items-center gap-1"
                          style={{ backgroundColor: color.replace('bg-', '') === 'blue-500' ? '#3b82f6' : '#6366f1' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                          <span className="truncate">{ev.title}</span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-gray-400 pl-1 font-medium">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Selected Day Agenda */}
        <Card className="p-4 sm:p-6 flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Agenda</h3>
              <p className="text-xs text-gray-400">{formatDate(selectedDate)}</p>
            </div>
            <Button
              size="sm"
              icon={Plus}
              onClick={() => { setForm(prev => ({ ...prev, date: selectedDate })); setModalOpen(true); }}
            >
              Add
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No events on this day</p>
              </div>
            ) : (
              selectedDateEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {EVENT_CATEGORIES[ev.category]?.label || ev.category}
                    </span>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{ev.title}</h4>
                    {ev.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{ev.description}</p>
                    )}
                    {ev.time && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-2 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ev.time}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setDeletingEvent(ev)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                    aria-label="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Add Event Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Calendar Event">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Event Title"
            placeholder="e.g. Design Sync, Dentist"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            autoFocus
          />
          <Textarea
            label="Description"
            placeholder="Location, link or notes..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <Input
              label="Time"
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </div>
          <Select
            label="Category"
            options={categoryOptions}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Event</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        onConfirm={() => deleteEvent(deletingEvent.id)}
        title="Delete Event"
        message={`Delete "${deletingEvent?.title}"? This cannot be undone.`}
      />
    </div>
  );
}
