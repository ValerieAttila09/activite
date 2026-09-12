import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil daftar task backlog
export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Gagal mengambil data task' }, { status: 500 });
  }
}

// POST: Tambah task baru ke backlog
export async function POST(req: Request) {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });

    const body = await req.json();
    const { title, description, estimatedDuration, priority } = body;

    const newTask = await prisma.task.create({
      data: {
        userId: user.id,
        title,
        description,
        estimatedDuration: estimatedDuration || 30,
        priority: priority || 'MEDIUM',
        status: 'BACKLOG',
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Gagal membuat task' }, { status: 500 });
  }
}