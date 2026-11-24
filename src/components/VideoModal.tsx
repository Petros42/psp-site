import { useEffect } from 'react';
import type { LibraryItem } from '../data/library';
import type { Language } from '../types';

interface VideoModalProps {
  video: LibraryItem | null;
  currentLang: Language;
  backToExtrasLabel: string;
  onBackToExtras: () => void;
  onClose: () => void;
}

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function getYouTubeEmbedUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    let videoId: string | null = null;

    if (host === 'youtu.be') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] ?? null;
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
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
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
    }
  } catch {
    // Not a full URL (e.g., local /videos/... path)
  }

  return null;
}

function isSafeLocalOrHttpsVideo(rawUrl: string): boolean {
  if (rawUrl.startsWith('/') && !rawUrl.startsWith('//')) {
    return true;
  }
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function VideoModal({
  video,
  currentLang,
  backToExtrasLabel,
  onBackToExtras,
  onClose,
}: VideoModalProps) {
  useEffect(() => {
    if (!video) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [video, onClose]);

  if (!video || !video.url.trim()) {
    return null;
  }

  const title = video.title[currentLang];
  const embedUrl = getYouTubeEmbedUrl(video.url.trim());
  const localSrc = !embedUrl && isSafeLocalOrHttpsVideo(video.url.trim()) ? video.url.trim() : null;

  return (
    <div
      className="video-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="video-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="video-modal-top">
          <button
            type="button"
            className="modal-back-btn"
            onClick={onBackToExtras}
          >
            <span aria-hidden="true">←</span>
            <span>{backToExtrasLabel}</span>
          </button>
          <button
            type="button"
            className="video-modal-close"
            aria-label="Close video"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <h2 className="video-modal-title video-modal-title--below">{title}</h2>

        <div className="video-modal-stage">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="video-modal-frame"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : localSrc ? (
            <video
              src={localSrc}
              className="video-modal-frame"
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
