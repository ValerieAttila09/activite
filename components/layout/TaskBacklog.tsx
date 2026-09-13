'use client';

import React, { useEffect, useState } from 'react';
import TaskItem from '@/components/task/TaskItem';
import TaskModal, { TaskData } from '@/components/task/TaskModal';
import { useDailyWorkloadMinutes } from '@/store/useCalendarStore';
import { AlertCircle, Plus, Trash2, Edit3 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function TaskBacklog() {
  const { status } = useSession(); // Status autentikasi
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);

  const workloadMinutes = useDailyWorkloadMinutes();
  const maxThresholdMinutes = 480;
  const percentage = Math.min(Math.round((workloadMinutes / maxThresholdMinutes) * 100), 100);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        console.error('Fetch tasks status:', res.status);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  // Jalankan fetch HANYA setelah sesi terkonfirmasi authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchTasks();
    }
  }, [status]);

  const handleSaveTask = async (task: TaskData) => {
    if (task.id) {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
    } else {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
    }
    fetchTasks();
  };

  // Hapus Task
  const handleDeleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

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
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
            title="Tambah Tugas Baru"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Capacity Bar */}
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

      {/* List Tasks */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
        {tasks.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-6">Belum ada tugas di backlog</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="relative group">
              <TaskItem
                id={task.id!}
                title={task.title}
                estimatedDuration={task.estimatedDuration}
              />
              
              {/* Overlay Action Edit & Delete */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => {
                    setEditingTask(task);
                    setIsModalOpen(true);
                  }}
                  className="p-1 hover:text-blue-400 text-slate-400"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id!)}
                  className="p-1 hover:text-rose-400 text-slate-400"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
      />
    </aside>
  );
}