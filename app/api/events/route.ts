import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Mencegah Next.js meng-cache data event secara statis
export const dynamic = 'force-dynamic';

// GET: Ambil daftar event & kalender milik user yang sedang login
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terotentikasi' }, { status: 401 });
    }

    const calendars = await prisma.calendar.findMany({
      where: { userId: session.user.id },
      include: {
        events: true,
      },
    });

    const events = calendars.flatMap((cal) => cal.events);

    return NextResponse.json({ calendars, events });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Gagal mengambil data event' }, { status: 500 });
  }
}

// POST: Buat event baru (hasil drag & drop dari task ke calendar)
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terotentikasi' }, { status: 401 });
    }

    const body = await req.json();
    const { calendarId, taskId, title, startTime, endTime } = body;

    // Jika calendarId tidak dikirim dari UI, otomatis ambil Kalender Utama user
    let targetCalendarId = calendarId;
    if (!targetCalendarId) {
      const primaryCal = await prisma.calendar.findFirst({
        where: { userId: session.user.id, provider: 'PRIMARY' },
      });
      targetCalendarId = primaryCal?.id;
    }

    if (!targetCalendarId) {
      return NextResponse.json({ error: 'Kalender tidak ditemukan' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        calendarId: targetCalendarId,
        taskId: taskId || null,
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: 'CONFIRMED',
      },
    });

    // Jika event dibuat dari task, perbarui status task menjadi IN_PROGRESS
    if (taskId) {
      await prisma.task.update({
        where: { id: taskId, userId: session.user.id },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Gagal membuat event' }, { status: 500 });
  }
}