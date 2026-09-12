'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Clock, GripVertical } from 'lucide-react';

export interface TaskItemProps {
  id: string;
  title: string;
  estimatedDuration: number; // dalam menit
}

export default function TaskItem({ id, title, estimatedDuration }: TaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `task-${id}`,
    data: {
      type: 'TASK',
      task: { id, title, estimatedDuration },
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 bg-slate-900/90 border border-slate-800 rounded-lg flex items-center justify-between group hover:border-slate-700 transition-all select-none cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-40 ring-2 ring-blue-500 shadow-xl' : ''
      }`}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <button {...listeners} {...attributes} className="text-slate-600 group-hover:text-slate-400 p-0.5">
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{title}</p>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{estimatedDuration} mnt</span>
          </div>
        </div>
      </div>
    </div>
  );
}