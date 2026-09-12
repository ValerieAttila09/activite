import "dotenv/config";

import {
  PrismaClient,
  CalendarProvider,
  TaskStatus,
  TaskPriority,
  EventStatus,
  WorkLocationType,
  RitualType,
  RitualStatus,
  FocusStatus,
} from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

async function main() {
  console.log('Menghapus data lama...');

  await prisma.bookingAppointment.deleteMany();
  await prisma.bookingAvailability.deleteMany();
  await prisma.bookingLink.deleteMany();
  await prisma.dailyRitualLog.deleteMany();
  await prisma.focusSession.deleteMany();
  await prisma.event.deleteMany();
  await prisma.task.deleteMany();
  await prisma.calendar.deleteMany();
  await prisma.workingLocation.deleteMany();
  await prisma.user.deleteMany();

  console.log('Membuat data baru...');

  // 1. Data Pengguna Utama
  const user = await prisma.user.create({
    data: {
      email: 'valerie@example.com',
      name: 'Valerie Attila Al-Fath',
      timezone: 'Asia/Jakarta',
      workStartTime: '08:00',
      workEndTime: '17:00',
      workDays: [1, 2, 3, 4, 5],
      dailyThresholdMinutes: 480,
    },
  });

  // 2. Data Lokasi Kerja
  const today = new Date('2026-09-12');
  await prisma.workingLocation.createMany({
    data: [
      {
        userId: user.id,
        date: new Date('2026-09-11'),
        location: WorkLocationType.OFFICE,
        note: 'WFO Kantor Pusat',
      },
      {
        userId: user.id,
        date: today,
        location: WorkLocationType.REMOTE,
        note: 'WFH Rumah Studio',
      },
    ],
  });

  // 3. Data Kalender (Primary & Overlay External)
  const primaryCal = await prisma.calendar.create({
    data: {
      userId: user.id,
      provider: CalendarProvider.PRIMARY,
      name: 'Kalender Utama',
      colorHex: '#3B82F6',
      isOverlay: false,
      isVisible: true,
    },
  });

  const workCal = await prisma.calendar.create({
    data: {
      userId: user.id,
      provider: CalendarProvider.GOOGLE,
      externalId: 'google-work-cal-id-123',
      name: 'Kalender Pekerjaan Google',
      colorHex: '#10B981',
      isOverlay: true,
      isVisible: true,
    },
  });

  // 4. Data Tugas (Backlog & Task List)
  const task1 = await prisma.task.create({
    data: {
      userId: user.id,
      title: 'Riset Komponen React & DnD Kit',
      description: 'Menganalisis performa dnd-kit vs react-dnd untuk kisi-kisi kalender',
      estimatedDuration: 120,
      actualDuration: 90,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      position: 1.0,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      userId: user.id,
      title: 'Membuat API Controller Drag & Drop',
      description: 'Endpoint REST untuk mengubah event timestamp dari task',
      estimatedDuration: 60,
      actualDuration: 0,
      status: TaskStatus.BACKLOG,
      priority: TaskPriority.MEDIUM,
      position: 2.0,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      userId: user.id,
      title: 'Review PR Backend Service Golang',
      description: 'Pengecekan queue sync webhook',
      estimatedDuration: 45,
      actualDuration: 45,
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.URGENT,
      position: 3.0,
    },
  });

  // 5. Data Event Kalender (Hasil Drag & Drop & Standalone Event)
  const event1 = await prisma.event.create({
    data: {
      calendarId: primaryCal.id,
      taskId: task1.id,
      title: 'Time-Block: Riset Komponen React & DnD Kit',
      description: 'Fokus pengerjaan riset komponen',
      startTime: new Date('2026-09-12T09:00:00.000Z'),
      endTime: new Date('2026-09-12T11:00:00.000Z'),
      status: EventStatus.CONFIRMED,
    },
  });

  await prisma.event.create({
    data: {
      calendarId: workCal.id,
      title: 'Sync Meeting Tim Engineering',
      description: 'Rapat koordinasi mingguan tim dev',
      startTime: new Date('2026-09-12T13:00:00.000Z'),
      endTime: new Date('2026-09-12T14:00:00.000Z'),
      status: EventStatus.CONFIRMED,
    },
  });

  // 6. Data Sesi Fokus (Focus Timer)
  await prisma.focusSession.create({
    data: {
      userId: user.id,
      taskId: task1.id,
      eventId: event1.id,
      startTime: new Date('2026-09-12T09:05:00.000Z'),
      endTime: new Date('2026-09-12T10:35:00.000Z'),
      durationMinutes: 90,
      status: FocusStatus.COMPLETED,
      notes: 'Selesai 90 menit tanpa distraksi',
    },
  });

  // 7. Data Log Rutin Harian (Guided Daily Ritual)
  await prisma.dailyRitualLog.create({
    data: {
      userId: user.id,
      date: today,
      type: RitualType.MORNING_PLANNING,
      status: RitualStatus.COMPLETED,
      plannedMinutes: 225,
      completedTasksCount: 1,
      reflection: 'Siap mengeksekusi time-block hari ini',
      completedAt: new Date('2026-09-12T08:15:00.000Z'),
    },
  });

  // 8. Data Booking Links & Janji Temu
  const bookingLink = await prisma.bookingLink.create({
    data: {
      userId: user.id,
      slug: 'valerie/tech-consultation-30m',
      title: 'Sesi Diskusi Arsitektur Web',
      description: 'Sesi konsultasi 30 menit mengenai React dan Golang',
      durationMinutes: 30,
      bufferBeforeMinutes: 5,
      bufferAfterMinutes: 10,
      isActive: true,
      availabilities: {
        create: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
          { dayOfWeek: 3, startTime: '13:00', endTime: '16:00' },
        ],
      },
    },
  });

  await prisma.bookingAppointment.create({
    data: {
      bookingLinkId: bookingLink.id,
      guestName: 'Budi Santoso',
      guestEmail: 'budi@example.com',
      guestNotes: 'Ingin mendiskusikan integrasi Redis queue',
      startTime: new Date('2026-09-14T10:00:00.000Z'),
      endTime: new Date('2026-09-14T10:30:00.000Z'),
      status: EventStatus.CONFIRMED,
    },
  });

  console.log('Seeding basis data berhasil!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });