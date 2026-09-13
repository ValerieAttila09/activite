'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import { useCalendarStore } from '@/store/useCalendarStore';
import { Command } from 'lucide-react';

export default function DashboardPage() {
  const { status } = useSession();
  const { setCalendars, setEvents } = useCalendarStore();

  useEffect(() => {
    // Jalankan fetch HANYA jika status autentikasi sudah terkonfirmasi
    if (status !== 'authenticated') return;

    let cancelled = false;

    const loadEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) return;

        const data = await response.json();
        if (cancelled) return;

        setCalendars(
          data.calendars.map((calendar: {
            id: string;
            name: string;
            colorHex: string;
            provider: 'PRIMARY' | 'GOOGLE' | 'OUTLOOK' | 'ICLOUD';
            isVisible: boolean;
            isOverlay: boolean;
          }) => ({
            id: calendar.id,
            name: calendar.name,
            colorHex: calendar.colorHex,
            provider: calendar.provider,
            isVisible: calendar.isVisible,
            isOverlay: calendar.isOverlay,
          }))
        );
        setEvents(data.events);
      } catch (error) {
        console.error('Gagal memuat event kalender:', error);
      }
    };

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, [status, setCalendars, setEvents]);

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