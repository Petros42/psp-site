export type Language = 'el' | 'en' | 'ru';

export type CategoryId = 'nature' | 'letters' | 'foundations' | 'resources' | 'embodiment' | 'patterns' | 'possibilities' | 'methodology' | 'applications' | 'training' | 'school';

export type SimWidth = 'full' | '390' | '412' | '768' | '1200';

export interface SubgroupHeader {
  title: string;
  subtitle?: string;
}

export interface PassageSubgroup {
  title: string;
  subtitle?: string;
  additionalHeaders?: SubgroupHeader[];
  paragraphs?: string[];
  bullets?: string[];
}

export interface Passage {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  subgroups?: PassageSubgroup[];
  closingParagraphs?: string[];
}

export interface CategoryContent {
  title: string;
  lead?: string;
  progress: string;
  passages: Passage[];
}

export type ActiveView =
  | { type: 'front' }
  | { type: 'category'; id: CategoryId }
  | { type: 'gallery' };

export interface GalleryContent {
  tag: string;
  title: string;
  intro: string;
}

export interface GalleryPhoto {
  src: string;
  alt?: string;
}

export interface NavItem {
  title: string;
  action?: 'front' | 'category' | 'gallery';
  categoryId?: CategoryId;
  note?: string;
  separated?: boolean;
}

export interface LocaleContent {
  menuLabel: string;
  backFront: string;
  sectionLabel: string;
  prevCategory: string;
  nextCategory: string;
  contactLabel: string;
  privacyLabel: string;
  lines: string[];
  programmes: string;
  programmesTitle: string;
  programmesBody: string;
  drawerContact: string;
  toggleProgrammes: string;
  toggleToolbar: string;
  contactHeading: string;
  contactText: string;
  copyLabel: string;
  copiedLabel: string;
  privacyTitle: string;
  privacyBody: string;
  categories: Record<CategoryId, CategoryContent>;
  gallery: GalleryContent;
  nav: NavItem[];
}

export type ModalState =
  | null
  | { type: 'contact' }
  | { type: 'privacy' }
  | { type: 'programmes' }
  | { type: 'note'; title: string; text: string };
