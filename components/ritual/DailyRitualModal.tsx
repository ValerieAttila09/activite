'use client';

import React, { useState } from 'react';
import { useCalendarStore, useDailyWorkloadMinutes } from '@/store/useCalendarStore';
import { Sparkles, Sun, CheckCircle2, ArrowRight, X, BatteryCharging } from 'lucide-react';

export default function DailyRitualModal() {
  const { isDailyRitualOpen, setDailyRitualOpen } = useCalendarStore();
  const workloadMinutes = useDailyWorkloadMinutes();
  
  const [step, setStep] = useState(1);
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>('high');
  const [targetHours, setTargetHours] = useState(6);

  if (!isDailyRitualOpen) return null;

  const handleComplete = () => {
    setDailyRitualOpen(false);
    setStep(1); // Reset step buat dipanggil lagi besok
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 ring-1 ring-blue-500/20">
        
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
                Guided Ritual
              </span>
              <h3 className="text-base font-bold text-slate-100">Perencanaan Pagi Harian</h3>
            </div>
          </div>
          <button 
            onClick={() => setDailyRitualOpen(false)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Wizard per Step */}
        <div className="p-6 space-y-6">

          {/* STEP 1: Cek Tingkat Energi & Fokus */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Bagaimana kondisi energimu pagi ini?</h4>
                <p className="text-xs text-slate-400 mt-1">Ini bakal ngebantu menentukan kapasitas beban kerja ideal hari ini.</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'high', label: 'Tinggi 🔥', desc: 'Siap gass 6-8 jam' },
                  { id: 'medium', label: 'Sedang ⚡', desc: 'Fokus 4-6 jam' },
                  { id: 'low', label: 'Santai 🌿', desc: 'Cukup 2-4 jam' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEnergyLevel(item.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      energyLevel === item.id
                        ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-200">{item.label}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Atur Target Jam Kerja Fokus */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Berapa jam target fokus maksimal hari ini?</h4>
                <p className="text-xs text-slate-400 mt-1">Sistem bakal ngasih peringatan kalau jadwalmu melampaui angka ini.</p>
              </div>

              <div className="bg-slate-900/80 p-4 border border-slate-800 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Target Jam:</span>
                  <span className="font-mono font-bold text-blue-400 text-base">{targetHours} Jam</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={10}
                  step={1}
                  value={targetHours}
                  onChange={(e) => setTargetHours(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Ringkasan & Konfirmasi */}
          {step === 3 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">Hari Ini Siap Dijalani!</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Tarik task dari backlog ke kisi-kisi jam kalender buat mulai time-blocking.
                </p>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-around text-xs">
                <div>
                  <span className="text-slate-500 block">Kondisi Energi</span>
                  <span className="font-semibold text-slate-200 capitalize">{energyLevel}</span>
                </div>
                <div className="w-px bg-slate-800" />
                <div>
                  <span className="text-slate-500 block">Target Fokus</span>
                  <span className="font-semibold text-blue-400">{targetHours} Jam</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Kembali
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-colors"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mulai Hari Ini</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}