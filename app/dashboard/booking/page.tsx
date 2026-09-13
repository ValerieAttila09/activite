'use client';

import React, { useEffect, useState } from 'react';
import { Link as LinkIcon, Copy, Clock, Check, Calendar, Plus } from 'lucide-react';

interface BookingLinkItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  durationMinutes: number;
  isActive: boolean;
}

export default function BookingManagerPage() {
  const [links, setLinks] = useState<BookingLinkItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Dummy fetch inisialisasi / ganti dengan API fetch
    setLinks([
      {
        id: '1',
        slug: 'valerie/tech-consultation-30m',
        title: 'Sesi Diskusi Arsitektur Web',
        description: 'Sesi konsultasi 30 menit mengenai React dan Golang',
        durationMinutes: 30,
        isActive: true,
      },
    ]);
  }, []);

  const handleCopy = (slug: string, id: string) => {
    const fullUrl = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Native Booking Links</h1>
          <p className="text-xs text-slate-400 mt-1">Kelola tautan janji temu publik yang terhubung langsung ke kalendermu.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors">
          <Plus className="w-4 h-4" />
          <span>Buat Link Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => (
          <div key={link.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  {link.durationMinutes} Menit
                </span>
                <h3 className="font-bold text-slate-100 text-base mt-2">{link.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{link.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500 truncate max-w-[200px]">/book/{link.slug}</span>
              <button
                onClick={() => handleCopy(link.slug, link.id)}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                {copiedId === link.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}