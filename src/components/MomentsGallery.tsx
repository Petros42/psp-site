import { GALLERY_PHOTOS, GALLERY_SLOT_COUNT } from '../data/gallery';
import type { CategoryId, GalleryContent } from '../types';

interface MomentsGalleryProps {
  active: boolean;
  isPreviewMode: boolean;
  gallery: GalleryContent;
  backFrontLabel: string;
  prevLabel: string;
  lastCategory: { id: CategoryId; title: string };
  onBackFront: () => void;
  onSelectCategory: (categoryId: CategoryId) => void;
  onOpenLightbox: (index: number) => void;
}

export function MomentsGallery({
  active,
  isPreviewMode,
  gallery,
  backFrontLabel,
  prevLabel,
  lastCategory,
  onBackFront,
  onSelectCategory,
  onOpenLightbox,
}: MomentsGalleryProps) {
  const hasPhotos = GALLERY_PHOTOS.length > 0;
  const placeholderSlots = Array.from({ length: GALLERY_SLOT_COUNT }, (_, idx) => idx);

  return (
    <section
      className={`category-reader moments-gallery${active ? ' active' : ''}`}
      id="momentsGallery"
      aria-live="polite"
    >
      <div className="reader-topbar">
        <button
          type="button"
          className="back-front-btn"
          onClick={onBackFront}
        >
          {backFrontLabel}
        </button>

        <span className="reader-progress">{gallery.tag}</span>
      </div>

      <h1 className="reader-category-title reader-category-title--with-lead">
        {gallery.title}
      </h1>

      <p className="reader-category-lead">{gallery.intro}</p>

      {(hasPhotos || isPreviewMode) && (
        <div className="moments-grid">
          {hasPhotos
            ? GALLERY_PHOTOS.map((photo, index) => (
                <button
                  type="button"
                  className="moment-card"
                  key={photo.src}
                  aria-label={`${gallery.title} ${index + 1}`}
                  onClick={() => onOpenLightbox(index)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt ?? ''}
                    loading="lazy"
                  />
                </button>
              ))
            : placeholderSlots.map((slot) => (
                <div
                  className="moment-placeholder"
                  key={slot}
                  aria-hidden="true"
                >
                  <span className="moment-placeholder-num">
                    {String(slot + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
        </div>
      )}

      <nav className="reader-footer-nav" aria-label="Gallery navigation">
        <button
          type="button"
          className="reader-nav-card reader-nav-card--prev"
          onClick={() => onSelectCategory(lastCategory.id)}
        >
          <span className="reader-nav-dir">← {prevLabel}</span>
          <span className="reader-nav-title">{lastCategory.title}</span>
        </button>
        <div />
      </nav>
    </section>
  );
}
