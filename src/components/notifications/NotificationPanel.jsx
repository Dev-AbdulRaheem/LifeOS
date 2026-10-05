import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickOutside } from '../../hooks/useClickOutside';
import { formatDate } from '../../utils/dateUtils';

const typeIcons = {
  task: '✅',
  habit: '🔥',
  goal: '🎯',
  focus: '⏱️',
  info: 'ℹ️',
};

export default function NotificationPanel({ isOpen, onClose }) {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useAppData();

  const ref = useClickOutside(onClose);
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-96 max-h-[500px] bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col
      overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200
        dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700
              dark:text-brand-400 text-xs px-2 py-0.5 rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
                text-gray-500 text-xs"
              aria-label="Mark all as read"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100
                  dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50
                  transition-colors ${!notif.read ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}
              >
                <span className="text-lg mt-0.5">{typeIcons[notif.type] || 'ℹ️'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${!notif.read
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDate(notif.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {!notif.read && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700
                        text-gray-400"
                      aria-label="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20
                      text-gray-400 hover:text-red-500"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
