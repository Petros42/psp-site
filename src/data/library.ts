import type { Language } from '../types';

export type LibraryItemKind = 'pdf' | 'video';

export interface LibraryItem {
  id: string;
  kind: LibraryItemKind;
  /** External URL (e.g. YouTube link) or local file in /public/pdfs/ (e.g. "/pdfs/book-a.pdf"). Leave empty until ready. */
  url: string;
  /** Optional custom thumbnail image path (e.g. "/photos/thumb-1.jpg"). YouTube URLs automatically get a 16:9 thumbnail if omitted. */
  thumbnail?: string;
  /** Optional CSS object-position for custom thumbnail framing (e.g. "center 25%"). */
  thumbnailPosition?: string;
  /** Optional list of languages where this item is displayed (if omitted, shown in all languages). */
  languages?: Language[];
  /** Compact editorial tag shown right above the title (e.g. "Book A · PDF"). */
  tag?: Record<Language, string>;
  title: Record<Language, string>;
  /** Short readable legend shown directly under the title inside Extras and in the PDF reader header. */
  subtitle: Record<Language, string>;
}

/**
 * Extras items split cleanly into Texts (kind: 'pdf') and Videos (kind: 'video').
 * Upload your PDFs to /public/pdfs/ and set url to "/pdfs/filename.pdf".
 * Add more PDFs or videos anytime by appending entries to this array.
 */
export const LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'book-a',
    kind: 'pdf',
    url: '/pdfs/PSPsc-BOOK%20A-Reflections%20on%20the%20miracle%20of%20human%20experiencing-EXTRAS.pdf',
    tag: {
      en: 'Book A · PDF',
      el: 'Book A · PDF',
      ru: 'Book A · PDF',
    },
    title: {
      en: 'Reflections on the Miracle of Human Experiencing',
      el: 'Reflections on the Miracle of Human Experiencing (μόνο αγγλικά)',
      ru: 'Reflections on the Miracle of Human Experiencing (только на английском)',
    },
    subtitle: {
      en: 'Contents. A conceptual map of the book. Preface.',
      el: 'Contents. A conceptual map of the book. Preface.',
      ru: 'Contents. A conceptual map of the book. Preface.',
    },
  },
  {
    id: 'book-c',
    kind: 'pdf',
    url: '/pdfs/PSPsc-BOOK%20C-Pathways%20into%20the%20Dynamics%20of%20Lived%20Experience-EXTRAS.pdf',
    tag: {
      en: 'Book C · PDF',
      el: 'Book C · PDF',
      ru: 'Book C · PDF',
    },
    title: {
      en: 'Pathways into the Dynamics of Lived Experience',
      el: 'Pathways into the Dynamics of Lived Experience (μόνο αγγλικά)',
      ru: 'Pathways into the Dynamics of Lived Experience (только на английском)',
    },
    subtitle: {
      en: 'Contents. Preface. Excerpts.',
      el: 'Contents. Preface. Excerpts.',
      ru: 'Contents. Preface. Excerpts.',
    },
  },
  {
    id: 'booklet-iv-structure',
    kind: 'pdf',
    url: '/pdfs/PSPsc-bkl%20IV-Structure%20of%20the%20FULL%20PSP%20training%20framework-EXTRAS.pdf',
    tag: {
      en: 'Booklet IV · PDF',
      el: 'Booklet IV · PDF',
      ru: 'Booklet IV · PDF',
    },
    title: {
      en: 'Structure of the Full PSP Training Framework',
      el: 'Structure of the Full PSP Training Framework (μόνο αγγλικά)',
      ru: 'Structure of the Full PSP Training Framework (только на английском)',
    },
    subtitle: {
      en: 'Introductions to all training levels. Compact schedules of the Basic Programme.',
      el: 'Introductions to all training levels. Compact schedules of the Basic Programme.',
      ru: 'Introductions to all training levels. Compact schedules of the Basic Programme.',
    },
  },
  {
    id: 'booklet-iv-navigation',
    kind: 'pdf',
    url: '/pdfs/PSPsc-bkl%20IV-A%20Navigation%20and%20Quick%20Reference%20Guide-BASIC%20PROGRAMME-EXTRAS.pdf',
    tag: {
      en: 'Booklet IV · PDF',
      el: 'Booklet IV · PDF',
      ru: 'Booklet IV · PDF',
    },
    title: {
      en: 'A Navigation & Quick Reference Guide to the Basic Programme',
      el: 'A Navigation & Quick Reference Guide to the Basic Programme (μόνο αγγλικά)',
      ru: 'A Navigation & Quick Reference Guide to the Basic Programme (только на английском)',
    },
    subtitle: {
      en: 'Lists of time slots for all nine days — per day and per category.',
      el: 'Lists of time slots for all nine days — per day and per category.',
      ru: 'Lists of time slots for all nine days — per day and per category.',
    },
  },
  {
    id: 'psp-short-video',
    kind: 'video',
    url: '/videos/1%20psp-small%20intro%20NEW%20480x272.mp4',
    title: {
      en: 'PSP — Visual Prelude',
      el: 'PSP — Μια πρώτη ματιά',
      ru: 'PSP — Первый взгляд',
    },
    subtitle: {
      en: 'Short symbolic video with music; no words.',
      el: 'Σύντομο συμβολικό βίντεο με μουσική, χωρίς λόγια.',
      ru: 'Картинка и музыка',
    },
  },
  {
    id: 'existential-intrapersonal-loneliness',
    kind: 'video',
    url: 'https://youtu.be/OUG8VUZMZAE',
    languages: ['en', 'ru'],
    title: {
      en: 'Existential & Intrapersonal Loneliness',
      el: 'Existential & Intrapersonal Loneliness',
      ru: 'Экзистенциальное и внутриличностное одиночество',
    },
    subtitle: {
      en: 'Opening reflection from a seminar on loneliness through PSP.',
      el: 'Opening reflection from a seminar on loneliness through PSP.',
      ru: 'Вступление к семинару об одиночестве через PSP (на английском языке).',
    },
  },
];
