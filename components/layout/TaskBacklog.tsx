'use client';

import React from 'react';
import TaskItem from '@/components/task/TaskItem';
import { useDailyWorkloadMinutes } from '@/store/useCalendarStore';
import { AlertCircle, Plus } from 'lucide-react';

// Data tugas dummy untuk pengetesan backlog
const DUMMY_TASKS = [
  { id: 't-1', title: 'Riset Komponen React & DnD Kit', estimatedDuration: 120 },
  { id: 't-2', title: 'Membuat API Controller Drag & Drop', estimatedDuration: 60 },
  { id: 't-3', title: 'Review PR Backend Service Golang', estimatedDuration: 45 },
];

export default function TaskBacklog() {
  const workloadMinutes = useDailyWorkloadMinutes();
  const maxThresholdMinutes = 480;
  const percentage = Math.min(Math.round((workloadMinutes / maxThresholdMinutes) * 100), 100);

  const getProgressColor = () => {
    if (workloadMinutes > maxThresholdMinutes) return 'bg-rose-500';
    if (percentage > 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <aside className="w-80 border-l border-slate-800 bg-slate-950 p-4 flex flex-col text-slate-200 min-h-screen">
      <div className="space-y-3 pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-100">Task Backlog</h2>
          <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Workload Threshold Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Kapasitas Hari Ini</span>
            <span className="font-mono font-medium text-slate-200">
              {Math.floor(workloadMinutes / 60)}j {workloadMinutes % 60}m / 8j
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {workloadMinutes > maxThresholdMinutes && (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs mt-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Beban kerja melebihi batas jam harian!</span>
            </div>
          )}
        </div>
      </div>

      {/* Task List Draggable */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
        {DUMMY_TASKS.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            title={task.title}
            estimatedDuration={task.estimatedDuration}
          />
        ))}
      </div>
    </aside>
  );
}