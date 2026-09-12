'use client';

import React from 'react';
import TimeSlot from './TimeSlot';
import EventBlock from './EventBlock';
import { useCalendarStore, useVisibleEvents } from '@/store/useCalendarStore';

export default function CalendarGrid() {
  const visibleEvents = useVisibleEvents();
  const { calendars } = useCalendarStore();

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const workStart = 8;
  const workEnd = 17;

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
        <span>Waktu Standar (WIB / GMT+7)</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-700 inline-block" /> Jam Kerja (08:00 - 17:00)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-950 border border-slate-800 inline-block" /> Luar Jam Kerja
          </span>
        </div>
      </div>

      <div className="divide-y divide-slate-800/40">
        {hours.map((hour) => {
          const isWorkingHour = hour >= workStart && hour < workEnd;
          const eventsInHour = visibleEvents.filter((evt) => {
            const evtHour = new Date(evt.startTime).getHours();
            return evtHour === hour;
          });

          return (
            <TimeSlot key={hour} hour={hour} isWorkingHour={isWorkingHour}>
              <div className="space-y-1.5">
                {eventsInHour.map((evt) => {
                  const parentCal = calendars.find((c) => c.id === evt.calendarId);
                  return (
                    <EventBlock
                      key={evt.id}
                      event={evt}
                      colorHex={parentCal?.colorHex}
                      isOverlay={parentCal?.isOverlay}
                    />
                  );
                })}
              </div>
            </TimeSlot>
          );
        })}
      </div>
    </div>
  );
}