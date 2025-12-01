"use client";


import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Flame } from 'lucide-react';

type TimerMode = 'work' | 'break';

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const workDuration = 25 * 60;
  const breakDuration = 5 * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'work') {
      setSessions((prev) => prev + 1);
      setMode('break');
      setTimeLeft(breakDuration);
    } else {
      setMode('work');
      setTimeLeft(workDuration);
    }

    // Play notification sound (in a real app)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(mode === 'work' ? 'Time for a break!' : 'Back to work!');
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? workDuration : breakDuration);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? workDuration : breakDuration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = mode === 'work' 
    ? ((workDuration - timeLeft) / workDuration) * 100
    : ((breakDuration - timeLeft) / breakDuration) * 100;

  return (
    <div className="bg-black/60 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-green-500/30 mb-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => switchMode('work')}
          className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
            mode === 'work'
              ? 'bg-green-500 text-black shadow-lg shadow-green-500/50'
              : 'bg-gray-900 text-green-400 hover:bg-gray-800 border border-green-500/30'
          }`}
        >
          <Flame className="w-4 h-4" />
          Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
            mode === 'break'
              ? 'bg-green-500 text-black shadow-lg shadow-green-500/50'
              : 'bg-gray-900 text-green-400 hover:bg-gray-800 border border-green-500/30'
          }`}
        >
          <Coffee className="w-4 h-4" />
          Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="rgba(34, 197, 94, 0.1)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#22c55e"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-green-400 text-6xl font-light tracking-wider">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-green-500/60 mt-2 uppercase tracking-widest text-sm">
            {mode === 'work' ? 'Focus Time' : 'Break Time'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={resetTimer}
          className="p-4 bg-gray-900 hover:bg-gray-800 text-green-400 rounded-full transition-all duration-300 border border-green-500/30"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={toggleTimer}
          className="p-6 bg-green-500 text-black rounded-full hover:scale-110 transition-all duration-300 shadow-xl shadow-green-500/50"
        >
          {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
      </div>

      {/* Sessions Counter */}
      <div className="mt-6 text-center text-green-500/60">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(sessions, 8) }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-green-500 rounded-full" />
          ))}
        </div>
        <p className="mt-2 uppercase tracking-wider text-sm">
          {sessions} session{sessions !== 1 ? 's' : ''} completed
        </p>
      </div>
    </div>
  );
}