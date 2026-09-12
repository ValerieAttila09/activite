import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil daftar event & kalender milik user
export async function GET() {
  try {
    // Ambil user pertama (atau berdasarkan session auth nantinya)
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    const calendars = await prisma.calendar.findMany({
      where: { userId: user.id },
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

// POST: Buat event baru (misal hasil drag & drop dari task ke calendar)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { calendarId, taskId, title, startTime, endTime } = body;

    const newEvent = await prisma.event.create({
      data: {
        calendarId,
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
        where: { id: taskId },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Gagal membuat event' }, { status: 500 });
  }
}