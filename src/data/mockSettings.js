export function generateMockSettings() {
  return {
    theme: 'system',
    notifications: {
      taskReminders: true,
      habitReminders: true,
      focusAlerts: true,
      goalMilestones: true,
      soundEnabled: true,
    },
    focus: {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
    },
    tasks: {
      defaultPriority: 'medium',
      defaultView: 'list',
    },
    preferences: {
      weekStartDay: 'monday',
      dateFormat: 'MM/DD/YYYY',
    },
  };
}
