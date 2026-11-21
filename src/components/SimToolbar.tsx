import type { SimWidth } from '../types';

interface SimToolbarProps {
  simWidth: SimWidth;
  simZoom: number;
  onSelectWidth: (width: SimWidth) => void;
  onSelectZoom: (zoom: number) => void;
  onResetAndHide: () => void;
}

const WIDTH_OPTIONS: { value: SimWidth; label: string }[] = [
  { value: 'full', label: 'Full' },
  { value: '390', label: '390px' },
  { value: '412', label: 'A56 (412)' },
  { value: '768', label: 'Tablet (768)' },
  { value: '1200', label: 'Desktop (1200)' },
];

const ZOOM_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: '100%' },
  { value: 0.85, label: '85%' },
  { value: 0.75, label: '75%' },
  { value: 0.6, label: '60%' },
  { value: 0.5, label: '50%' },
];

export function SimToolbar({
  simWidth,
  simZoom,
  onSelectWidth,
  onSelectZoom,
  onResetAndHide,
}: SimToolbarProps) {
  return (
    <div className="sim-toolbar" id="simToolbar" role="region" aria-label="Screen size and zoom preview">
      <div className="sim-toolbar-row">
        <span className="sim-toolbar-tag">Screen:</span>
        {WIDTH_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`sim-chip${simWidth === opt.value ? ' active' : ''}`}
            onClick={() => onSelectWidth(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="sim-toolbar-row">
        <span className="sim-toolbar-tag">Zoom:</span>
        {ZOOM_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`sim-chip${Math.abs(simZoom - opt.value) < 0.01 ? ' active' : ''}`}
            onClick={() => onSelectZoom(opt.value)}
          >
            {opt.label}
          </button>
        ))}
        <button
          type="button"
          className="sim-close-chip"
          id="simCloseToolbarBtn"
          onClick={onResetAndHide}
        >
          Reset &amp; Hide
        </button>
      </div>
    </div>
  );
}
