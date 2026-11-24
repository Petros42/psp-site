import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
import type { LibraryItem } from '../data/library';
import type { Language } from '../types';

interface PdfModalProps {
  pdf: LibraryItem | null;
  currentLang: Language;
  backToExtrasLabel: string;
  openPdfLabel: string;
  onBackToExtras: () => void;
  onClose: () => void;
}

function isSafePdfUrl(rawUrl: string): boolean {
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

interface PdfPageCanvasProps {
  doc: PDFDocumentProxy;
  pageNumber: number;
  containerWidth: number;
  zoom: number;
}

function PdfPageCanvas({ doc, pageNumber, containerWidth, zoom }: PdfPageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null;

    async function renderPage() {
      try {
        const page = await doc.getPage(pageNumber);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const targetCssWidth = Math.max(240, (containerWidth - 28) * zoom);
        const cssScale = targetCssWidth / baseViewport.width;
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);

        const cssViewport = page.getViewport({ scale: cssScale });
        const renderViewport = page.getViewport({ scale: cssScale * outputScale });

        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        canvas.width = Math.floor(renderViewport.width);
        canvas.height = Math.floor(renderViewport.height);
        canvas.style.width = `${Math.floor(cssViewport.width)}px`;
        canvas.style.height = `${Math.floor(cssViewport.height)}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        renderTask = page.render({
          canvas,
          canvasContext: ctx,
          viewport: renderViewport,
        });

        await renderTask.promise;
      } catch {
        // Ignore cancelled renders when zooming or closing modal
      }
    }

    renderPage();

    return () => {
      cancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {
          // Already finished
        }
      }
    };
  }, [doc, pageNumber, containerWidth, zoom]);

  return (
    <div className="pdf-page-sheet">
      <canvas ref={canvasRef} className="pdf-page-canvas" />
      <span className="pdf-page-num">{pageNumber}</span>
    </div>
  );
}

const LOADING_LABEL: Record<Language, string> = {
  en: 'Loading document…',
  el: 'Φόρτωση κειμένου…',
  ru: 'Загрузка документа…',
};

const ERROR_LABEL: Record<Language, string> = {
  en: 'Could not render this PDF inline. Use the Download button above to open it.',
  el: 'Δεν ήταν δυνατή η προβολή του PDF εδώ. Χρησιμοποιήστε το κουμπί λήψης επάνω.',
  ru: 'Не удалось отобразить PDF здесь. Используйте кнопку скачивания выше.',
};

export function PdfModal({
  pdf,
  currentLang,
  backToExtrasLabel,
  openPdfLabel,
  onBackToExtras,
  onClose,
}: PdfModalProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(760);

  const trimmedUrl = pdf?.url.trim() ?? '';
  const validUrl = trimmedUrl && isSafePdfUrl(trimmedUrl) ? trimmedUrl : '';

  useEffect(() => {
    if (!pdf) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pdf, onClose]);

  useEffect(() => {
    if (!stageRef.current || !pdf) return;
    const el = stageRef.current;

    const updateWidth = () => {
      if (el.clientWidth > 0) {
        setContainerWidth(el.clientWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, [pdf]);

  useEffect(() => {
    if (!validUrl) {
      setPdfDoc(null);
      setNumPages(0);
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    let activeTask: PDFDocumentLoadingTask | null = null;

    setLoading(true);
    setError(false);
    setPdfDoc(null);
    setNumPages(0);
    setZoom(1);

    async function loadPdf() {
      try {
        const [pdfjs, workerMod, response] = await Promise.all([
          import('pdfjs-dist'),
          import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
          fetch(validUrl),
        ]);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        if (cancelled) return;

        pdfjs.GlobalWorkerOptions.workerSrc = workerMod.default;
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
        activeTask = loadingTask;
        const doc = await loadingTask.promise;

        if (cancelled) {
          loadingTask.destroy().catch(() => {});
          return;
        }

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
      if (activeTask) {
        activeTask.destroy().catch(() => {});
      }
    };
  }, [validUrl]);

  if (!pdf || !validUrl) {
    return null;
  }

  const title = pdf.title[currentLang];
  const subtitle = pdf.subtitle[currentLang];
  const downloadFilename = `${pdf.id}.pdf`;

  return (
    <div
      className="pdf-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="pdf-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-top">
          <button
            type="button"
            className="modal-back-btn"
            onClick={onBackToExtras}
          >
            <span aria-hidden="true">←</span>
            <span>{backToExtrasLabel}</span>
          </button>

          <div className="pdf-modal-actions">
            {numPages > 0 && (
              <div className="pdf-zoom-group" aria-label="Zoom">
                <button
                  type="button"
                  className="pdf-zoom-btn"
                  aria-label="Zoom out"
                  disabled={zoom <= 0.75}
                  onClick={() => setZoom((z) => Math.max(0.75, Math.round((z - 0.25) * 100) / 100))}
                >
                  −
                </button>
                <span className="pdf-zoom-readout">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  className="pdf-zoom-btn"
                  aria-label="Zoom in"
                  disabled={zoom >= 2}
                  onClick={() => setZoom((z) => Math.min(2, Math.round((z + 0.25) * 100) / 100))}
                >
                  +
                </button>
              </div>
            )}

            <a
              href={validUrl}
              download={downloadFilename}
              className="pdf-open-external"
            >
              <span>{openPdfLabel}</span>
              <span aria-hidden="true">↓</span>
            </a>

            <button
              type="button"
              className="video-modal-close"
              aria-label="Close document"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        <div className="pdf-modal-meta">
          <h2 className="pdf-modal-title">{title}</h2>
          {subtitle && <p className="pdf-modal-subtitle">{subtitle}</p>}
        </div>

        <div className="pdf-modal-stage pdf-modal-stage--canvas" ref={stageRef}>
          {loading && <div className="pdf-status-msg">{LOADING_LABEL[currentLang]}</div>}

          {error && <div className="pdf-status-msg">{ERROR_LABEL[currentLang]}</div>}

          {!loading && !error && pdfDoc && (
            <div className="pdf-pages-stack">
              {Array.from({ length: numPages }, (_, idx) => (
                <PdfPageCanvas
                  key={idx + 1}
                  doc={pdfDoc}
                  pageNumber={idx + 1}
                  containerWidth={containerWidth}
                  zoom={zoom}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
