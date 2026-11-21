import type { CategoryContent, CategoryId } from '../types';

interface AdjacentCategory {
  id: CategoryId;
  title: string;
}

interface GalleryLink {
  tag: string;
  title: string;
  onOpen: () => void;
}

interface CategoryReaderProps {
  category: CategoryContent | null;
  backFrontLabel: string;
  sectionLabel: string;
  currentIndex: number;
  totalCategories: number;
  prevLabel: string;
  nextLabel: string;
  prevCategory: AdjacentCategory | null;
  nextCategory: AdjacentCategory | null;
  galleryLink?: GalleryLink | null;
  onBackFront: () => void;
  onSelectCategory: (categoryId: CategoryId) => void;
}

export function CategoryReader({
  category,
  backFrontLabel,
  sectionLabel,
  currentIndex,
  totalCategories,
  prevLabel,
  nextLabel,
  prevCategory,
  nextCategory,
  galleryLink,
  onBackFront,
  onSelectCategory,
}: CategoryReaderProps) {
  return (
    <section
      className={`category-reader${category ? ' active' : ''}`}
      id="categoryReader"
      aria-live="polite"
    >
      <div className="reader-topbar">
        <button
          type="button"
          className="back-front-btn"
          id="backFrontBtn"
          onClick={onBackFront}
        >
          {backFrontLabel}
        </button>

        <div className="reader-nav-group">
          <button
            type="button"
            className="reader-step-btn"
            aria-label={prevCategory ? `${prevLabel}: ${prevCategory.title}` : prevLabel}
            disabled={!prevCategory}
            onClick={() => prevCategory && onSelectCategory(prevCategory.id)}
          >
            ‹
          </button>
          <span className="reader-progress" id="readerProgress">
            {currentIndex > 0 ? `${sectionLabel} ${currentIndex} / ${totalCategories}` : ''}
          </span>
          <button
            type="button"
            className="reader-step-btn"
            aria-label={nextCategory ? `${nextLabel}: ${nextCategory.title}` : nextLabel}
            disabled={!nextCategory}
            onClick={() => nextCategory && onSelectCategory(nextCategory.id)}
          >
            ›
          </button>
        </div>
      </div>

      <h1
        className={`reader-category-title${category?.lead ? ' reader-category-title--with-lead' : ''}`}
        id="readerTitle"
      >
        {category?.title ?? ''}
      </h1>

      {category?.lead && <p className="reader-category-lead">{category.lead}</p>}

      <div id="readerPassages">
        {category?.passages.map((passage, pIndex) => (
          <article className="passage-block" key={pIndex}>
            {passage.heading && <h2 className="passage-heading">{passage.heading}</h2>}

            {(passage.paragraphs ?? []).map((para, idx) => (
              <p className="passage-paragraph" key={idx}>
                {para}
              </p>
            ))}

            {passage.bullets && (
              <ul className="passage-list">
                {passage.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            )}

            {passage.subgroups &&
              passage.subgroups.map((sg, sgIndex) =>
                sg.subtitle ? (
                  <div className="passage-subgroup-entry" key={sgIndex}>
                    <div className="passage-subgroup-header">
                      <div className="passage-subgroup-title">{sg.title}</div>
                      <div className="passage-subgroup-subtitle">{sg.subtitle}</div>
                    </div>
                    {(sg.additionalHeaders ?? []).map((hdr, hdrIdx) => (
                      <div className="passage-subgroup-header" key={hdrIdx}>
                        <div className="passage-subgroup-title">{hdr.title}</div>
                        {hdr.subtitle && (
                          <div className="passage-subgroup-subtitle">{hdr.subtitle}</div>
                        )}
                      </div>
                    ))}
                    {(sg.paragraphs ?? []).map((para, idx) => (
                      <p className="passage-paragraph" key={idx}>
                        {para}
                      </p>
                    ))}
                    {sg.bullets && (
                      <ul className="passage-list">
                        {sg.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="passage-subgroup" key={sgIndex}>
                    <div className="passage-subgroup-title">{sg.title}</div>
                    {(sg.paragraphs ?? []).map((para, idx) => (
                      <p className="passage-paragraph" key={idx}>
                        {para}
                      </p>
                    ))}
                    {sg.bullets && (
                      <ul className="passage-list">
                        {sg.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              )}

            {(passage.closingParagraphs ?? []).map((para, idx) => (
              <p className="passage-paragraph" key={idx}>
                {para}
              </p>
            ))}
          </article>
        ))}
      </div>

      {category && (prevCategory || nextCategory || galleryLink) && (
        <nav className="reader-footer-nav" aria-label="Category navigation">
          {prevCategory ? (
            <button
              type="button"
              className="reader-nav-card reader-nav-card--prev"
              onClick={() => onSelectCategory(prevCategory.id)}
            >
              <span className="reader-nav-dir">← {prevLabel}</span>
              <span className="reader-nav-title">{prevCategory.title}</span>
            </button>
          ) : (
            <div />
          )}

          {nextCategory ? (
            <button
              type="button"
              className="reader-nav-card reader-nav-card--next"
              onClick={() => onSelectCategory(nextCategory.id)}
            >
              <span className="reader-nav-dir">{nextLabel} →</span>
              <span className="reader-nav-title">{nextCategory.title}</span>
            </button>
          ) : galleryLink ? (
            <button
              type="button"
              className="reader-nav-card reader-nav-card--next"
              onClick={galleryLink.onOpen}
            >
              <span className="reader-nav-dir">{galleryLink.tag} →</span>
              <span className="reader-nav-title">{galleryLink.title}</span>
            </button>
          ) : (
            <div />
          )}
        </nav>
      )}
    </section>
  );
}
