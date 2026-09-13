import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Mencegah Next.js meng-cache response API GET secara statis
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terotentikasi' }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
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
    // Ambil session user yang sedang login
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terotentikasi' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, estimatedDuration, priority } = body;

    const newTask = await prisma.task.create({
      data: {
        userId: session.user.id, // Hubungkan ke ID user dari session Google
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