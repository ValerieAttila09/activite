'use client';

import React, { useEffect } from 'react';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import { useCalendarStore } from '@/store/useCalendarStore';
import { Command } from 'lucide-react';

export default function DashboardPage() {
  const { setEvents } = useCalendarStore();

  // Inisialisasi dummy event untuk pengetesan grid & drag-and-drop
  useEffect(() => {
    const today = new Date();
    
    const start1 = new Date(today.setHours(9, 0, 0, 0)).toISOString();
    const end1 = new Date(today.setHours(11, 0, 0, 0)).toISOString();

    const start2 = new Date(today.setHours(13, 0, 0, 0)).toISOString();
    const end2 = new Date(today.setHours(14, 0, 0, 0)).toISOString();

    setEvents([
      {
        id: 'evt-1',
        calendarId: '1',
        title: 'Time-Block: Riset Komponen React & DnD Kit',
        startTime: start1,
        endTime: end1,
        isAllDay: false,
      },
      {
        id: 'evt-2',
        calendarId: '2',
        title: 'Sync Meeting Tim Engineering',
        startTime: start2,
        endTime: end2,
        isAllDay: false,
      },
    ]);
  }, [setEvents]);

  return (
    <>
      {/* Header Utama Kalender */}
      <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg text-slate-100">Sabtu, 12 September 2026</h1>
          <span className="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300 font-medium">Hari Ini</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors">
            <Command className="w-3.5 h-3.5" />
            <span>Tekan <kbd className="font-mono bg-slate-800 px-1 rounded text-slate-200">Cmd + K</kbd></span>
          </button>
        </div>
      </header>

      {/* Area Kisi-Kisi Waktu Kalender */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
        <CalendarGrid />
      </div>
    </>
  );
}