import type { LibraryItemKind } from '../data/library';

interface BottomBarProps {
  contactLabel: string;
  extrasPrefixLabel: string;
  extrasPdfsLabel: string;
  extrasVideosLabel: string;
  openExtrasKind: LibraryItemKind | null;
  privacyLabel: string;
  onOpenContact: () => void;
  onToggleExtras: (kind: LibraryItemKind) => void;
  onOpenPrivacy: () => void;
}

export function BottomBar({
  contactLabel,
  extrasPrefixLabel,
  extrasPdfsLabel,
  extrasVideosLabel,
  openExtrasKind,
  privacyLabel,
  onOpenContact,
  onToggleExtras,
  onOpenPrivacy,
}: BottomBarProps) {
  return (
    <footer className="bottom-bar">
      <div className="footer-left-group">
        <button
          type="button"
          className="footer-pill"
          id="contactBtn"
          onClick={onOpenContact}
        >
          {contactLabel}
        </button>

        <button
          type="button"
          className={`footer-pill footer-pill--stacked${openExtrasKind === 'pdf' ? ' active' : ''}`}
          id="extrasPdfsBtn"
          aria-expanded={openExtrasKind === 'pdf'}
          aria-controls="libraryPopover"
          onClick={() => onToggleExtras('pdf')}
        >
          <span className="footer-pill-kicker">{extrasPrefixLabel}</span>
          <span className="footer-pill-main">{extrasPdfsLabel}</span>
        </button>

        <button
          type="button"
          className={`footer-pill footer-pill--stacked${openExtrasKind === 'video' ? ' active' : ''}`}
          id="extrasVideosBtn"
          aria-expanded={openExtrasKind === 'video'}
          aria-controls="libraryPopover"
          onClick={() => onToggleExtras('video')}
        >
          <span className="footer-pill-kicker">{extrasPrefixLabel}</span>
          <span className="footer-pill-main">{extrasVideosLabel}</span>
        </button>
      </div>

      <div className="footer-right-group">
        <div className="social-links" aria-label="Social channels">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="YouTube"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="4" />
              <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Instagram"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Facebook"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </div>

        <button
          type="button"
          className="footer-link"
          id="privacyBtn"
          onClick={onOpenPrivacy}
        >
          {privacyLabel}
        </button>
      </div>
    </footer>
  );
}
