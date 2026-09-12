'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface TimeSlotProps {
  hour: number;
  isWorkingHour: boolean;
  children?: React.ReactNode;
}

export default function TimeSlot({ hour, isWorkingHour, children }: TimeSlotProps) {
  const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
  const slotId = `slot-${hour}`;

  const { isOver, setNodeRef } = useDroppable({
    id: slotId,
    data: { hour },
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative min-h-[64px] border-b border-slate-800/60 flex transition-colors ${
        !isWorkingHour ? 'bg-slate-950/50' : 'bg-slate-900/30'
      } ${isOver ? 'bg-blue-500/10 border-blue-500/50' : ''}`}
    >
      {/* Label Jam (Sisi Kiri) */}
      <div className="w-16 flex-shrink-0 pr-3 pt-1 text-right text-xs font-mono text-slate-500 select-none border-r border-slate-800/40">
        {formattedHour}
      </div>

      {/* Content Area untuk Event Block */}
      <div className="flex-1 relative p-1">
        {children}
      </div>
    </div>
  );
}