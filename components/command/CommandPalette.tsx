'use client';

import React, { useEffect, useState } from 'react';
import { useCalendarStore } from '@/store/useCalendarStore';
import { 
  Search, 
  Plus, 
  Sparkles, 
  Link as LinkIcon, 
  Play, 
  Eye, 
  Calendar as CalendarIcon 
} from 'lucide-react';

export default function CommandPalette() {
  const { 
    isCommandPaletteOpen, 
    setCommandPaletteOpen, 
    toggleCommandPalette,
    calendars,
    toggleCalendarVisibility,
    startFocusSession
  } = useCalendarStore();

  const [search, setSearch] = useState('');

  // Global Keyboard Listener (Cmd + K / Ctrl + K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, toggleCommandPalette, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Daftar Aksi Cepat
  const actions = [
    {
      id: 'quick-focus',
      label: 'Mulai Focus Mode Instan',
      icon: Play,
      category: 'Fokus',
      perform: () => startFocusSession('Sesi Fokus Cepat', undefined, undefined),
    },
    // Ganti bagian perform pada aksi 'daily-ritual':
    {
    id: 'daily-ritual',
    label: 'Buka Guided Daily Ritual',
    icon: Sparkles,
    category: 'Rutinitas',
    perform: () => useCalendarStore.getState().setDailyRitualOpen(true),
    },
    {
      id: 'copy-link',
      label: 'Salin Native Booking Link',
      icon: LinkIcon,
      category: 'Jadwal',
      perform: () => navigator.clipboard.writeText('https://activite.app/book/valerie'),
    },
  ];

  const filteredActions = actions.filter((action) =>
    action.label.toLowerCase().includes(search.toLowerCase())
  );

  const executeAction = (action: typeof actions[0]) => {
    action.perform();
    setCommandPaletteOpen(false);
    setSearch('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-28 px-4">
      {/* Overlay Backdrop Click to Close */}
      <div 
        className="fixed inset-0" 
        onClick={() => setCommandPaletteOpen(false)} 
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 text-slate-100 ring-1 ring-slate-800">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-800 bg-slate-900/50">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0 mr-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ketik perintah atau cari aksi..."
            className="w-full bg-transparent py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
            autoFocus
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded">ESC</kbd>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Aksi Cepat
          </div>

          {filteredActions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              Tidak ada perintah yang cocok dengan "{search}"
            </div>
          ) : (
            filteredActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => executeAction(action)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-900 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-slate-900 group-hover:bg-slate-800 text-blue-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-slate-200 font-medium">{action.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {action.category}
                  </span>
                </button>
              );
            })
          )}

          {/* Toggle Kalender Layering Section */}
          <div className="px-2 pt-3 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Filter Tampilan Kalender
          </div>
          {calendars.map((cal) => (
            <button
              key={cal.id}
              onClick={() => {
                toggleCalendarVisibility(cal.id);
                setCommandPaletteOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-900 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cal.colorHex }} />
                <span className="text-sm text-slate-300">Toggle {cal.name}</span>
              </div>
              <Eye className={`w-4 h-4 ${cal.isVisible ? 'text-blue-400' : 'text-slate-600'}`} />
            </button>
          ))}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/40 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Gunakan tombol panah & enter untuk navigasi</span>
          <span>Activité Command v1.0</span>
        </div>
      </div>
    </div>
  );
}