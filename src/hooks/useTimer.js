import { useState, useRef, useEffect, useCallback } from 'react';

// Timer that stores target end timestamp for accuracy even when tab is throttled.
// duration is in minutes.
export function useTimer(initialDuration = 25) {
  const [status, setStatus] = useState('idle'); // idle | running | paused
  const [remainingSeconds, setRemainingSeconds] = useState(initialDuration * 60);
  const endTimeRef = useRef(null);
  const pausedRemainingRef = useRef(initialDuration * 60);
  const intervalRef = useRef(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (!endTimeRef.current) return;
    const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
    setRemainingSeconds(remaining);
    if (remaining <= 0) {
      clearTimerInterval();
      setStatus('completed');
    }
  }, [clearTimerInterval]);

  // Start the interval when status becomes 'running'
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(tick, 250); // tick every 250ms for smooth updates
    }
    return clearTimerInterval;
  }, [status, tick, clearTimerInterval]);

  const start = useCallback(() => {
    endTimeRef.current = Date.now() + pausedRemainingRef.current * 1000;
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    if (endTimeRef.current) {
      pausedRemainingRef.current = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
    }
    clearTimerInterval();
    setStatus('paused');
  }, [clearTimerInterval]);

  const resume = useCallback(() => {
    endTimeRef.current = Date.now() + pausedRemainingRef.current * 1000;
    setStatus('running');
  }, []);

  const reset = useCallback((newDuration) => {
    clearTimerInterval();
    const seconds = (newDuration || initialDuration) * 60;
    setRemainingSeconds(seconds);
    pausedRemainingRef.current = seconds;
    endTimeRef.current = null;
    setStatus('idle');
  }, [initialDuration, clearTimerInterval]);

  // Update document title while running
  useEffect(() => {
    if (status === 'running' || status === 'paused') {
      const mins = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      document.title = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} - LifeOS Focus`;
    } else {
      document.title = 'LifeOS';
    }
  }, [status, remainingSeconds]);

  return {
    status,
    remainingSeconds,
    start,
    pause,
    resume,
    reset,
    isRunning: status === 'running',
    isPaused: status === 'paused',
    isCompleted: status === 'completed',
    isIdle: status === 'idle',
  };
}
