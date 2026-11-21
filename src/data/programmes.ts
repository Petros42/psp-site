import type { Language } from '../types';

export interface UpcomingProgramme {
  id: string;
  date: Record<Language, string>;
  title: Record<Language, string>;
  location?: Record<Language, string>;
  details?: Record<Language, string>;
}

/**
 * Add upcoming PSP workshops, training cycles, or activities here.
 * When empty, the "Upcoming Programmes & Activities" button stays hidden for
 * regular visitors (and can be previewed by adding ?preview=true to the URL).
 */
export const UPCOMING_PROGRAMMES: UpcomingProgramme[] = [];
