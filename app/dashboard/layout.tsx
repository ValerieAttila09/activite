'use client';

import React from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import Sidebar from '@/components/layout/Sidebar';
import TaskBacklog from '@/components/layout/TaskBacklog';
import { useCalendarStore } from '@/store/useCalendarStore';
import FocusTimerBar from '@/components/focus/FocusTimerBar';
import CommandPalette from '@/components/command/CommandPalette';
import DailyRitualModal from '@/components/ritual/DailyRitualModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { moveEventAsync, addEventFromTaskOptimistic } = useCalendarStore();

  // Unified Drag End Handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const targetHour = over.data.current?.hour;
    if (targetHour === undefined) return;

    const activeId = active.id.toString();

    // SKENARIO 1: Menggeser Event yang Sudah Ada di Grid
    if (activeId.startsWith('event-')) {
      const eventData = active.data.current?.event;
      if (!eventData) return;

      const oldStart = new Date(eventData.startTime);
      const oldEnd = new Date(eventData.endTime);
      const durationMs = oldEnd.getTime() - oldStart.getTime();

      const newStart = new Date(oldStart);
      newStart.setHours(targetHour, 0, 0, 0);
      const newEnd = new Date(newStart.getTime() + durationMs);

      void moveEventAsync(eventData.id, newStart, newEnd);
    }

    // SKENARIO 2: Menarik Task Baru dari Backlog ke Kisi-Kisi Jam
    if (activeId.startsWith('task-')) {
      const taskData = active.data.current?.task;
      if (!taskData) return;

      const newStart = new Date();
      newStart.setHours(targetHour, 0, 0, 0);

      const durationMinutes = taskData.estimatedDuration || 60;
      const newEnd = new Date(newStart.getTime() + durationMinutes * 60 * 1000);

      // Buat event kalender baru berbasis data task
      addEventFromTaskOptimistic({
        id: `evt-from-task-${Date.now()}`,
        calendarId: '1', // Masukkan ke Kalender Utama
        taskId: taskData.id,
        title: taskData.title,
        startTime: newStart.toISOString(),
        endTime: newEnd.toISOString(),
        isAllDay: false,
      });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-screen bg-slate-900 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-slate-900 text-slate-100">
          {children}
        </main>
        <TaskBacklog />
        {/* Floating Focus Timer Bar */}
        <FocusTimerBar />
        <CommandPalette />
        <DailyRitualModal />
      </div>
    </DndContext>
  );
}