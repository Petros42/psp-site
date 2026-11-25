import { useEffect, useRef } from 'react';
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
      const originParam =
        typeof window !== 'undefined' && window.location.origin
          ? `&origin=${encodeURIComponent(window.location.origin)}`
          : '';
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&enablejsapi=1${originParam}`;
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rawUrl = video?.url.trim() ?? '';
  const embedUrl = rawUrl ? getYouTubeEmbedUrl(rawUrl) : null;
  const localSrc = !embedUrl && rawUrl && isSafeLocalOrHttpsVideo(rawUrl) ? rawUrl : null;

  useEffect(() => {
    if (!video) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBackToExtras();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [video, onBackToExtras]);

  // Listen for YouTube player "ended" state (playerState === 0) to return automatically to the Videos list
  useEffect(() => {
    if (!video || !embedUrl) return;

    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== 'https://www.youtube-nocookie.com' &&
        event.origin !== 'https://www.youtube.com'
      ) {
        return;
      }
      if (typeof event.data !== 'string') return;
      try {
        const payload = JSON.parse(event.data) as {
          event?: string;
          info?: number | { playerState?: number };
        };
        const state =
          payload.event === 'onStateChange' && typeof payload.info === 'number'
            ? payload.info
            : payload.event === 'infoDelivery' &&
                payload.info &&
                typeof payload.info === 'object'
              ? payload.info.playerState
              : null;

        if (state === 0) {
          onBackToExtras();
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [video, embedUrl, onBackToExtras]);

  if (!video || !rawUrl) {
    return null;
  }

  const title = video.title[currentLang];

  const handleYouTubeFrameLoad = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.postMessage(JSON.stringify({ event: 'listening' }), 'https://www.youtube-nocookie.com');
    } catch {
      // Ignore cross-origin postMessage restrictions
    }
  };

  return (
    <div
      className="video-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onBackToExtras}
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
              ref={iframeRef}
              src={embedUrl}
              title={title}
              className="video-modal-frame"
              onLoad={handleYouTubeFrameLoad}
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
              onEnded={onBackToExtras}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
