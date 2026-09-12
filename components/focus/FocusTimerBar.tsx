'use client';

import React, { useEffect } from 'react';
import { useCalendarStore } from '@/store/useCalendarStore';
import { Play, Pause, Square, Flame } from 'lucide-react';

export default function FocusTimerBar() {
  const { activeFocusSession, toggleFocusTimer, stopFocusSession, tickFocusTimer } = useCalendarStore();

  // Timer interval 1 detik saat running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeFocusSession?.isRunning) {
      interval = setInterval(() => {
        tickFocusTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeFocusSession?.isRunning, tickFocusTimer]);

  if (!activeFocusSession) return null;

  // Format detik menjadi MM:SS atau HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 border border-blue-500/40 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-6 text-slate-100 ring-1 ring-blue-500/20">
      {/* Label Sesi Fokus */}
      <div className="flex items-center gap-3 border-r border-slate-800 pr-5">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
          <Flame className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <span className="text-[10px] font-semibold tracking-wider text-blue-400 uppercase block">
            Focus Mode
          </span>
          <p className="text-sm font-semibold max-w-[200px] truncate text-slate-200">
            {activeFocusSession.title}
          </p>
        </div>
      </div>

      {/* Stopwatch Counter */}
      <div className="font-mono text-2xl font-bold tracking-wider text-white min-w-[90px] text-center">
        {formatTime(activeFocusSession.elapsedSeconds)}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2 border-l border-slate-800 pl-5">
        {/* Play/Pause */}
        <button
          onClick={toggleFocusTimer}
          className={`p-2.5 rounded-xl transition-all ${
            activeFocusSession.isRunning
              ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          }`}
          title={activeFocusSession.isRunning ? 'Jeda' : 'Lanjutkan'}
        >
          {activeFocusSession.isRunning ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Stop Sesi */}
        <button
          onClick={stopFocusSession}
          className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all"
          title="Selesaikan Sesi Fokus"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}