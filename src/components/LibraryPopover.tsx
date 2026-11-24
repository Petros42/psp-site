import { LIBRARY_ITEMS, type LibraryItem, type LibraryItemKind } from '../data/library';
import type { Language } from '../types';

interface LibraryPopoverProps {
  open: boolean;
  activeTab: LibraryItemKind;
  currentLang: Language;
  title: string;
  textsTabLabel: string;
  videosTabLabel: string;
  comingSoonLabel: string;
  onSelectTab: (tab: LibraryItemKind) => void;
  onClose: () => void;
  onOpenVideo: (item: LibraryItem) => void;
  onOpenPdf: (item: LibraryItem) => void;
}

function ItemIcon({ kind }: { kind: LibraryItemKind }) {
  if (kind === 'video') {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="5" width="20" height="14" rx="3.5" />
        <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export function LibraryPopover({
  open,
  activeTab,
  currentLang,
  title,
  textsTabLabel,
  videosTabLabel,
  comingSoonLabel,
  onSelectTab,
  onClose,
  onOpenVideo,
  onOpenPdf,
}: LibraryPopoverProps) {
  const pdfItems = LIBRARY_ITEMS.filter((item) => item.kind === 'pdf');
  const videoItems = LIBRARY_ITEMS.filter((item) => item.kind === 'video');
  const visibleItems = activeTab === 'pdf' ? pdfItems : videoItems;

  return (
    <div
      className={`library-popover${open ? ' open' : ''}`}
      id="libraryPopover"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-hidden={!open}
    >
      <div className="library-popover-header">
        <h2 className="library-popover-title">{title}</h2>
        <button
          type="button"
          className="close-btn"
          id="closeLibraryBtn"
          aria-label="Close extras"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="library-tabs" role="tablist" aria-label={title}>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pdf'}
          className={`library-tab-btn${activeTab === 'pdf' ? ' active' : ''}`}
          onClick={() => onSelectTab('pdf')}
        >
          <span>{textsTabLabel}</span>
          <span className="library-tab-count">{pdfItems.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'video'}
          className={`library-tab-btn${activeTab === 'video' ? ' active' : ''}`}
          onClick={() => onSelectTab('video')}
        >
          <span>{videosTabLabel}</span>
          <span className="library-tab-count">{videoItems.length}</span>
        </button>
      </div>

      <ul className="library-item-list" role="tabpanel">
        {visibleItems.map((item) => {
          const hasUrl = item.url.trim().length > 0;
          const itemTag = item.tag?.[currentLang];
          const itemTitle = item.title[currentLang];
          const itemSubtitle = item.subtitle[currentLang];

          const inner = (
            <>
              <span className="library-item-icon">
                <ItemIcon kind={item.kind} />
              </span>
              <span className="library-item-copy">
                {itemTag && <span className="library-item-tag">{itemTag}</span>}
                <span className="library-item-title">{itemTitle}</span>
                <span className="library-item-subtitle">{itemSubtitle}</span>
              </span>
              {hasUrl ? (
                <span className="library-item-arrow" aria-hidden="true">
                  {item.kind === 'video' ? '▶' : '›'}
                </span>
              ) : (
                <span className="library-item-status">{comingSoonLabel}</span>
              )}
            </>
          );

          if (hasUrl) {
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="library-item-row library-item-btn"
                  onClick={() =>
                    item.kind === 'video' ? onOpenVideo(item) : onOpenPdf(item)
                  }
                >
                  {inner}
                </button>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <div className="library-item-row library-item-row--pending" aria-disabled="true">
                {inner}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="library-popover-footer">
        <button
          type="button"
          className="close-btn"
          id="closeLibraryBottomBtn"
          aria-label="Close extras"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}
