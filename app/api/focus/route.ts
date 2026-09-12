import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Simpan hasil sesi fokus ke database
export async function POST(req: Request) {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });

    const body = await req.json();
    const { taskId, eventId, durationMinutes, notes } = body;

    const session = await prisma.focusSession.create({
      data: {
        userId: user.id,
        taskId: taskId || null,
        eventId: eventId || null,
        durationMinutes,
        status: 'COMPLETED',
        notes,
      },
    });

    // Tambahkan akumulasi durasi aktual pada Task
    if (taskId) {
      await prisma.task.update({
        where: { id: taskId },
        data: {
          actualDuration: { increment: durationMinutes },
        },
      });
    }

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Failed to save focus session:', error);
    return NextResponse.json({ error: 'Gagal menyimpan sesi fokus' }, { status: 500 });
  }
}