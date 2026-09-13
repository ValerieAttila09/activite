import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil detail booking link dan slot ketersediaan
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const fullSlug = slug.join('/');

    const bookingLink = await prisma.bookingLink.findFirst({
      where: { slug: fullSlug, isActive: true },
      include: {
        user: { select: { name: true, email: true, avatarUrl: true, timezone: true } },
        availabilities: true,
      },
    });

    if (!bookingLink) {
      return NextResponse.json({ error: 'Booking link tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(bookingLink);
  } catch (error) {
    console.error('Failed to fetch booking info:', error);
    return NextResponse.json({ error: 'Gagal memuat detail booking' }, { status: 500 });
  }
}

// POST: Tamu memesan slot waktu
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const fullSlug = slug.join('/');
    const body = await req.json();
    const { guestName, guestEmail, guestNotes, startTime, endTime } = body;

    const bookingLink = await prisma.bookingLink.findFirst({
      where: { slug: fullSlug, isActive: true },
    });

    if (!bookingLink) {
      return NextResponse.json({ error: 'Link booking tidak aktif' }, { status: 404 });
    }

    // 1. Simpan janji temu ke PostgreSQL
    const appointment = await prisma.bookingAppointment.create({
      data: {
        bookingLinkId: bookingLink.id,
        guestName,
        guestEmail,
        guestNotes,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    // 2. Otomatis buatkan Event di Kalender Utama user
    const primaryCal = await prisma.calendar.findFirst({
      where: { userId: bookingLink.userId, provider: 'PRIMARY' },
    });

    if (primaryCal) {
      await prisma.event.create({
        data: {
          calendarId: primaryCal.id,
          title: `[Booking] ${bookingLink.title} - ${guestName}`,
          description: `Janji temu publik.\nTamu: ${guestName} (${guestEmail})\nCatatan: ${guestNotes || '-'}`,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: 'CONFIRMED',
        },
      });
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Failed to book appointment:', error);
    return NextResponse.json({ error: 'Gagal membuat janji temu' }, { status: 500 });
  }
}