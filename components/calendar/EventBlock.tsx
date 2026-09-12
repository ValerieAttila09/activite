'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CalendarEvent } from '@/types/calendar';
import { Clock, GripVertical } from 'lucide-react';
import { useCalendarStore } from '@/store/useCalendarStore';
import { Play } from 'lucide-react';

interface EventBlockProps {
  event: CalendarEvent;
  colorHex?: string;
  isOverlay?: boolean;
}

export default function EventBlock({ event, colorHex = '#3B82F6', isOverlay = false }: EventBlockProps) {
  const { startFocusSession } = useCalendarStore();
	
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `event-${event.id}`,
    data: { event },
  });

  const styleCss = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  const startTimeStr = new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      ref={setNodeRef}
      className={`group rounded-lg p-2.5 text-xs border transition-all select-none cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 shadow-2xl ring-2 ring-blue-500' : ''
      } ${
        isOverlay
          ? 'border-dashed bg-slate-900/80 text-slate-300'
          : 'text-white shadow-md'
      }`}
      style={{
        ...styleCss,
        backgroundColor: isOverlay ? undefined : `${colorHex}20`,
        borderColor: colorHex,
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-1.5 font-semibold text-slate-100 truncate">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colorHex }} />
          <span className="truncate">{event.title}</span>
        </div>

        <button {...listeners} {...attributes} className="h-full flex flex-col place-content-between text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="hover:cursor-grab w-3.5 h-3.5 m-1" />
					<button
						onClick={(e) => {
							e.stopPropagation();
							startFocusSession(event.title, event.id, event.taskId || undefined);
						}}
						className="p-1 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 hover:cursor-pointer rounded transition-colors"
						title="Mulai Sesi Fokus"
					>
						<Play className="w-3.5 h-3.5" />
					</button>
        </button>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
        <Clock className="w-3 h-3 text-slate-500" />
        <span>{startTimeStr} - {endTimeStr}</span>
      </div>
    </div>
  );
}