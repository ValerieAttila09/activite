import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// PATCH: Edit data task
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terotentikasi' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description, estimatedDuration, priority, status } = body;

    const updatedTask = await prisma.task.update({
      where: { id, userId: session.user.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(estimatedDuration && { estimatedDuration: Number(estimatedDuration) }),
        ...(priority && { priority }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Gagal memperbarui task' }, { status: 500 });
  }
}

// DELETE: Hapus task dari backlog
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terotentikasi' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.task.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json({ error: 'Gagal menghapus task' }, { status: 500 });
  }
}