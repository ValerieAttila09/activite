'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  Flame, 
  Link as LinkIcon, 
  CheckCircle2, 
  ArrowRight, 
  Layers 
} from 'lucide-react';

export default function LandingPage() {
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* 1. Header Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <span>Activité</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all text-slate-200"
        >
          Masuk Akun
        </button>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Aplikasi Time-Blocking & Produktivitas Generasi Baru</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-100 leading-tight">
          Kuasai Waktumu, <br />
          <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            Eksekusi Hari dengan Fokus Sempurna
          </span>
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
          Hubungkan kalender, susun blok jam kerja dengan *drag-and-drop*, lindungi batas beban kerja harian, dan bagikan tautan *booking* tanpa konflik jadwal.
        </p>

        {/* CTA Login Button */}
        <div className="pt-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all text-sm"
          >
            <span>Mulai Gratis dengan Google</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-slate-500 mt-3">Tanpa kartu kredit. Langsung tersinkron dengan kalendermu.</p>
        </div>

        {/* 3. Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-16 w-full">
          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Drag & Drop Time Blocking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tarik tugas langsung dari backlog ke slot jam kerja kalender secara visual dan fleksibel.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Focus Timer & Real-time Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jalankan stopwatch fokus langsung dari time-block kalender untuk mencatat durasi kerja aktual.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <LinkIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-200 text-sm">Native Booking Links</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bagikan tautan janji temu publik. Sesi baru otomatis terdaftar di kalender utamamu.
            </p>
          </div>
        </div>
      </main>

      {/* 4. Minimalist Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-slate-900 text-center text-xs text-slate-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 Activité. Hak Cipta Dilindungi.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-400 cursor-pointer">Privasi</span>
          <span className="hover:text-slate-400 cursor-pointer">Ketentuan</span>
          <span className="hover:text-slate-400 cursor-pointer">Kontak</span>
        </div>
      </footer>
    </div>
  );
}