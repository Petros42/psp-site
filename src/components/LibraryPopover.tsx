import { LIBRARY_ITEMS, type LibraryItem, type LibraryItemKind } from '../data/library';
import type { Language } from '../types';

interface LibraryPopoverProps {
  openKind: LibraryItemKind | null;
  currentLang: Language;
  pdfsTitle: string;
  videosTitle: string;
  comingSoonLabel: string;
  onClose: () => void;
  onOpenVideo: (item: LibraryItem) => void;
  onOpenPdf: (item: LibraryItem) => void;
}

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function getYouTubeThumbnailUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    let videoId: string | null = null;

    if (host === 'youtu.be') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] ?? null;
    } else if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v');
      } else {
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (parts[0] === 'embed' || parts[0] === 'shorts') {
          videoId = parts[1] ?? null;
        }
      }
    }

    if (videoId && YOUTUBE_ID_PATTERN.test(videoId)) {
      return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    }
  } catch {
    // Not a YouTube URL
  }
  return null;
}

function PdfIcon() {
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

function VideoPlayEmblem() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="8 5 19 12 8 19 8 5" />
    </svg>
  );
}

export function LibraryPopover({
  openKind,
  currentLang,
  pdfsTitle,
  videosTitle,
  comingSoonLabel,
  onClose,
  onOpenVideo,
  onOpenPdf,
}: LibraryPopoverProps) {
  const isOpen = openKind !== null;
  const activeKind: LibraryItemKind = openKind ?? 'pdf';
  const isVideoView = activeKind === 'video';
  const title = isVideoView ? videosTitle : pdfsTitle;
  const visibleItems = LIBRARY_ITEMS.filter(
    (item) =>
      item.kind === activeKind &&
      (!item.languages || item.languages.includes(currentLang))
  );

  return (
    <div
      className={`library-popover${isVideoView ? ' library-popover--videos' : ''}${isOpen ? ' open' : ''}`}
      id="libraryPopover"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-hidden={!isOpen}
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

      {isVideoView ? (
        <ul className="library-video-grid">
          {visibleItems.map((item) => {
            const hasUrl = item.url.trim().length > 0;
            const itemTitle = item.title[currentLang];
            const itemSubtitle = item.subtitle[currentLang];
            const thumbSrc = item.thumbnail?.trim() || (hasUrl ? getYouTubeThumbnailUrl(item.url.trim()) : null);

            const cardBody = (
              <>
                <div className="library-video-thumb">
                  {isOpen && thumbSrc ? (
                    <img
                      src={thumbSrc}
                      alt=""
                      className="library-video-thumb-img"
                      style={item.thumbnailPosition ? { objectPosition: item.thumbnailPosition } : undefined}
                      loading="lazy"
                    />
                  ) : isOpen && hasUrl ? (
                    <video
                      src={`${item.url.trim()}#t=2`}
                      muted
                      playsInline
                      preload="metadata"
                      className="library-video-thumb-img"
                      aria-hidden="true"
                    />
                  ) : (
                    <div className="library-video-thumb-placeholder" aria-hidden="true" />
                  )}
                  <span className={`library-video-play-badge${hasUrl ? '' : ' is-pending'}`} aria-hidden="true">
                    <VideoPlayEmblem />
                  </span>
                  {!hasUrl && <span className="library-video-soon-pill">{comingSoonLabel}</span>}
                </div>

                <div className="library-video-copy">
                  <span className="library-item-title">{itemTitle}</span>
                  <span className="library-item-subtitle">{itemSubtitle}</span>
                </div>
              </>
            );

            return (
              <li key={item.id}>
                {hasUrl ? (
                  <button
                    type="button"
                    className="library-video-card library-video-card--interactive"
                    onClick={() => onOpenVideo(item)}
                  >
                    {cardBody}
                  </button>
                ) : (
                  <div className="library-video-card library-video-card--pending" aria-disabled="true">
                    {cardBody}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="library-item-list">
          {visibleItems.map((item) => {
            const hasUrl = item.url.trim().length > 0;
            const itemTag = item.tag?.[currentLang];
            const itemTitle = item.title[currentLang];
            const itemSubtitle = item.subtitle[currentLang];

            const inner = (
              <>
                <span className="library-item-icon">
                  <PdfIcon />
                </span>
                <span className="library-item-copy">
                  {itemTag && <span className="library-item-tag">{itemTag}</span>}
                  <span className="library-item-title">{itemTitle}</span>
                  <span className="library-item-subtitle">{itemSubtitle}</span>
                </span>
                {hasUrl ? (
                  <span className="library-item-arrow" aria-hidden="true">
                    ›
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
                    onClick={() => onOpenPdf(item)}
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
      )}

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
