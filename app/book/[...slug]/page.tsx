'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar as CalendarIcon, Clock, User, Mail, FileText, CheckCircle2 } from 'lucide-react';

export default function PublicBookingPage() {
  const params = useParams();
  const slugArray = params?.slug as string[];
  const slugPath = slugArray ? slugArray.join('/') : '';

  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({ guestName: '', guestEmail: '', guestNotes: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slugPath) return;

    fetch(`/api/public/booking/${slugPath}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setBookingInfo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slugPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const startTime = new Date(selectedSlot);
    const endTime = new Date(startTime.getTime() + (bookingInfo?.durationMinutes || 30) * 60 * 1000);

    const res = await fetch(`/api/public/booking/${slugPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }),
    });

    if (res.ok) {
      setIsSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center text-sm text-slate-400">
        Memuat detail janji temu...
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Janji Temu Dikonfirmasi!</h2>
          <p className="text-xs text-slate-400">
            Jadwal telah berhasil ditambahkan ke kalender {bookingInfo?.user?.name}. Detail konfirmasi telah dikirim ke emailmu.
          </p>
        </div>
      </div>
    );
  }

  // Jam slot dummy yang tersedia hari ini
  const dummySlots = [
    new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        
        {/* Sisi Kiri: Detail Sesi */}
        <div className="p-6 border-b md:border-b-0 md:border-r border-slate-800 space-y-4 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
              {bookingInfo?.user?.name?.[0] || 'V'}
            </div>
            <div>
              <p className="text-xs text-slate-400">{bookingInfo?.user?.name || 'Valerie Attila Al-Fath'}</p>
              <h2 className="text-lg font-bold text-slate-100">{bookingInfo?.title || 'Sesi Diskusi'}</h2>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300 pt-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{bookingInfo?.durationMinutes || 30} Menit</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              <span>{bookingInfo?.user?.timezone || 'Asia/Jakarta (GMT+7)'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
            {bookingInfo?.description}
          </p>
        </div>

        {/* Sisi Kanan: Form Booking & Slot Jam */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Pilih Jam Tersedia</h3>
          
          <div className="grid grid-cols-2 gap-2">
            {dummySlots.map((slot) => {
              const timeLabel = new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all ${
                    isSelected
                      ? 'bg-blue-600 border-blue-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {timeLabel}
                </button>
              );
            })}
          </div>

          {selectedSlot && (
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  placeholder="Nama Kamu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  value={formData.guestNotes}
                  onChange={(e) => setFormData({ ...formData, guestNotes: e.target.value })}
                  placeholder="Topik yang ingin didiskusikan..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors mt-2"
              >
                Konfirmasi Booking
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}