'use client';

import React from 'react';
import { useCalendarStore } from '@/store/useCalendarStore';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Link as LinkIcon, 
  Eye, 
  EyeOff, 
  Layers 
} from 'lucide-react';

export default function Sidebar() {
  const { calendars, toggleCalendarVisibility, toggleOverlayMode } = useCalendarStore();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4 flex flex-col justify-between text-slate-200 min-h-screen">
      <div className="space-y-6">
        {/* Header App / Brand */}
        <div className="flex items-center gap-2 font-bold text-lg text-white">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <span>Activité</span>
        </div>

        {/* Working Hours & Location Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Status Hari Ini</span>
            <span className="text-emerald-400 font-medium">08:00 - 17:00</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>WFH Rumah Studio</span>
          </div>
        </div>

        {/* Multi-calendar & Overlay Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Kalender Saya</span>
            <Layers className="w-3.5 h-3.5" />
          </div>

          <div className="space-y-1">
            {calendars.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Belum ada kalender</p>
            ) : (
              calendars.map((cal) => (
                <div
                  key={cal.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-slate-900 group transition-colors text-sm"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cal.colorHex }}
                    />
                    <span className="truncate text-slate-300">{cal.name}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Toggle Visibilitas */}
                    <button
                      onClick={() => toggleCalendarVisibility(cal.id)}
                      className="p-1 hover:text-white text-slate-400"
                      title="Sembunyikan / Tampilkan"
                    >
                      {cal.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                    </button>
                    {/* Toggle Mode Overlay */}
                    <button
                      onClick={() => toggleOverlayMode(cal.id)}
                      className={`px-1.5 py-0.5 text-[10px] rounded font-medium border ${
                        cal.isOverlay
                          ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                          : 'border-slate-700 text-slate-500'
                      }`}
                      title="Aktifkan Overlay Mode"
                    >
                      Overlay
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Access: Native Booking Link */}
      <div className="pt-4 border-t border-slate-800">
        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
          <LinkIcon className="w-4 h-4 text-blue-400" />
          <span>Salin Booking Link</span>
        </button>
      </div>
    </aside>
  );
}