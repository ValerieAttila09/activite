'use client';

import React, { useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SessionProvider } from 'next-auth/react'; // <-- Import SessionProvider
import Sidebar from '@/components/layout/Sidebar';
import TaskBacklog from '@/components/layout/TaskBacklog';
import FocusTimerBar from '@/components/focus/FocusTimerBar';
import CommandPalette from '@/components/command/CommandPalette';
import DailyRitualModal from '@/components/ritual/DailyRitualModal';
import { useCalendarStore } from '@/store/useCalendarStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCalendars, moveEventOptimistic, addEventFromTaskOptimistic } = useCalendarStore();

  useEffect(() => {
    setCalendars([
      { id: '1', name: 'Kalender Utama', colorHex: '#3B82F6', provider: 'PRIMARY', isVisible: true, isOverlay: false },
      { id: '2', name: 'Google Pekerjaan', colorHex: '#10B981', provider: 'GOOGLE', isVisible: true, isOverlay: true },
    ]);
  }, [setCalendars]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const targetHour = over.data.current?.hour;
    if (targetHour === undefined) return;

    const activeId = active.id.toString();

    if (activeId.startsWith('event-')) {
      const eventData = active.data.current?.event;
      if (!eventData) return;

      const oldStart = new Date(eventData.startTime);
      const oldEnd = new Date(eventData.endTime);
      const durationMs = oldEnd.getTime() - oldStart.getTime();

      const newStart = new Date(oldStart);
      newStart.setHours(targetHour, 0, 0, 0);
      const newEnd = new Date(newStart.getTime() + durationMs);

      moveEventOptimistic(eventData.id, newStart, newEnd);
    }

    if (activeId.startsWith('task-')) {
      const taskData = active.data.current?.task;
      if (!taskData) return;

      const newStart = new Date();
      newStart.setHours(targetHour, 0, 0, 0);

      const durationMinutes = taskData.estimatedDuration || 60;
      const newEnd = new Date(newStart.getTime() + durationMinutes * 60 * 1000);

      addEventFromTaskOptimistic({
        id: `evt-from-task-${Date.now()}`,
        calendarId: '1',
        taskId: taskData.id,
        title: taskData.title,
        startTime: newStart.toISOString(),
        endTime: newEnd.toISOString(),
        isAllDay: false,
      });
    }
  };

  return (
    // Bungkus dengan SessionProvider paling luar
    <SessionProvider>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex h-screen w-screen bg-slate-900 overflow-hidden relative">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 bg-slate-900 text-slate-100">
            {children}
          </main>
          <TaskBacklog />

          <FocusTimerBar />
          <CommandPalette />
          <DailyRitualModal />
        </div>
      </DndContext>
    </SessionProvider>
  );
}