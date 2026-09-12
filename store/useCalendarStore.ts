import { useMemo } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ViewMode, CalendarFilter, CalendarEvent, ActiveFocusSession } from '../types/calendar';

interface CalendarState {
  // --- STATE ---
  selectedDate: Date;
  viewMode: ViewMode;
  calendars: CalendarFilter[];
  events: CalendarEvent[];
  
  // Drag-and-Drop / Optimistic State
  draggedTaskId: string | null;
  previousEvents: CalendarEvent[]; // Dipakai untuk rollback jika API gagal
  isLoading: boolean;

  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  isDailyRitualOpen: boolean;
  setDailyRitualOpen: (open: boolean) => void;
  toggleDailyRitual: () => void;

  activeFocusSession: ActiveFocusSession | null;
  startFocusSession: (title: string, eventId?: string, taskId?: string) => void;
  toggleFocusTimer: () => void;
  stopFocusSession: () => void;
  tickFocusTimer: () => void;

  // --- ACTIONS ---
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: ViewMode) => void;
  
  // Filter Overlay Actions
  setCalendars: (calendars: CalendarFilter[]) => void;
  toggleCalendarVisibility: (calendarId: string) => void;
  toggleOverlayMode: (calendarId: string) => void;

  // Event & Optimistic Actions
  setEvents: (events: CalendarEvent[]) => void;
  setDraggedTaskId: (taskId: string | null) => void;
  
  // Drag & Drop Optimistic Update
  moveEventOptimistic: (eventId: string, newStart: Date, newEnd: Date) => void;
  addEventFromTaskOptimistic: (newEvent: CalendarEvent) => void;
  rollbackEvents: () => void;
}

export const useCalendarStore = create<CalendarState>()(
  devtools((set, get) => ({
    // Initial State
    selectedDate: new Date(),
    viewMode: 'day',
    calendars: [],
    events: [],
    draggedTaskId: null,
    previousEvents: [],
    isLoading: false,

    isDailyRitualOpen: false,
    setDailyRitualOpen: (isDailyRitualOpen) => set({ isDailyRitualOpen }),
    toggleDailyRitual: () =>
    set((state) => ({ isDailyRitualOpen: !state.isDailyRitualOpen })),

    isCommandPaletteOpen: false,
    setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
    toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

    // Date & View Handlers
    setSelectedDate: (selectedDate) => set({ selectedDate }),
    setViewMode: (viewMode) => set({ viewMode }),

    // Calendar & Overlay Filter Handlers
    setCalendars: (calendars) => set({ calendars }),
    
    toggleCalendarVisibility: (calendarId) =>
      set((state) => ({
        calendars: state.calendars.map((cal) =>
          cal.id === calendarId ? { ...cal, isVisible: !cal.isVisible } : cal
        ),
      })),

    toggleOverlayMode: (calendarId) =>
      set((state) => ({
        calendars: state.calendars.map((cal) =>
          cal.id === calendarId ? { ...cal, isOverlay: !cal.isOverlay } : cal
        ),
      })),

    // Data Handlers
    setEvents: (events) => set({ events }),
    setDraggedTaskId: (draggedTaskId) => set({ draggedTaskId }),

    // Optimistic Update: Menggeser Event di Grid
    moveEventOptimistic: (eventId, newStart, newEnd) => {
      const currentEvents = get().events;
      set({ previousEvents: currentEvents }); // Simpan cadangan untuk rollback

      set({
        events: currentEvents.map((evt) =>
          evt.id === eventId
            ? {
                ...evt,
                startTime: newStart.toISOString(),
                endTime: newEnd.toISOString(),
              }
            : evt
        ),
      });
    },

    // Optimistic Update: Menarik Task dari Backlog ke Grid
    addEventFromTaskOptimistic: (newEvent) => {
      const currentEvents = get().events;
      set({ previousEvents: currentEvents });

      set({
        events: [...currentEvents, newEvent],
      });
    },

    // Rollback jika request API gagal
    rollbackEvents: () =>
      set((state) => ({
        events: state.previousEvents,
        previousEvents: [],
      })),

      // Focus Timer Initial State
  activeFocusSession: null,

  // Focus Timer Actions
  startFocusSession: (title, eventId, taskId) =>
    set({
      activeFocusSession: {
        title,
        eventId,
        taskId,
        elapsedSeconds: 0,
        isRunning: true,
      },
    }),

  toggleFocusTimer: () =>
    set((state) => {
      if (!state.activeFocusSession) return {};
      return {
        activeFocusSession: {
          ...state.activeFocusSession,
          isRunning: !state.activeFocusSession.isRunning,
        },
      };
    }),

  stopFocusSession: () => set({ activeFocusSession: null }),

  tickFocusTimer: () =>
    set((state) => {
      if (!state.activeFocusSession || !state.activeFocusSession.isRunning) return {};
      return {
        activeFocusSession: {
          ...state.activeFocusSession,
          elapsedSeconds: state.activeFocusSession.elapsedSeconds + 1,
        },
      };
    }),
  })),
);

// Selectors (ditaruh di hooks terpisah atau file pendukung)
// ==========================================
// CUSTOM SELECTORS (MEMOIZED)
// ==========================================

// 1. Filter event yang hanya termasuk dalam kalender aktif/visible
export const useVisibleEvents = () => {
  const events = useCalendarStore((state) => state.events);
  const calendars = useCalendarStore((state) => state.calendars);

  return useMemo(() => {
    const visibleCalendarIds = new Set(
      calendars.filter((c) => c.isVisible).map((c) => c.id)
    );
    return events.filter((evt) => visibleCalendarIds.has(evt.calendarId));
  }, [events, calendars]);
};

// 2. Ambil statistik total durasi event aktif untuk indikator Workload Warning
export const useDailyWorkloadMinutes = () => {
  const events = useCalendarStore((state) => state.events);
  const calendars = useCalendarStore((state) => state.calendars);

  return useMemo(() => {
    const visibleCalendarIds = new Set(
      calendars.filter((c) => c.isVisible).map((c) => c.id)
    );
    const visibleEvents = events.filter((evt) =>
      visibleCalendarIds.has(evt.calendarId)
    );

    return visibleEvents.reduce((acc, evt) => {
      const start = new Date(evt.startTime).getTime();
      const end = new Date(evt.endTime).getTime();
      const durationMinutes = Math.round((end - start) / (1000 * 60));
      return acc + durationMinutes;
    }, 0);
  }, [events, calendars]);
};