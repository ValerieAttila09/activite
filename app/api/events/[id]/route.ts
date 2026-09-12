import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH: Update rentang waktu event saat digeser di grid
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { startTime, endTime } = body;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Failed to update event:', error);
    return NextResponse.json({ error: 'Gagal memperbarui event' }, { status: 500 });
  }
}