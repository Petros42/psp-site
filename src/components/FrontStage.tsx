import type { RefObject } from 'react';
import { LogoCard } from './LogoCard';

interface FrontStageProps {
  hidden: boolean;
  lines: string[];
  heroLinesRef: RefObject<HTMLDivElement | null>;
  programmesVisible: boolean;
  programmesLabel: string;
  onOpenProgrammes: () => void;
  onTogglePreviewMode: () => void;
}

export function FrontStage({
  hidden,
  lines,
  heroLinesRef,
  programmesVisible,
  programmesLabel,
  onOpenProgrammes,
  onTogglePreviewMode,
}: FrontStageProps) {
  return (
    <main className={`front-stage${hidden ? ' hidden' : ''}`} id="frontStage">
      <LogoCard onTripleClick={onTogglePreviewMode} />

      {/* Verbatim Trilingual Three-Line Intro */}
      <div className="hero-lines" id="heroLines" ref={heroLinesRef} aria-live="polite">
        {lines.map((line, index) => (
          <span key={index}>{line}</span>
        ))}
      </div>

      {/* Upcoming Programmes Slot (shown when events exist or toggled in ?preview=true) */}
      {programmesVisible && (
        <div className="programmes-slot visible" id="programmesSlot">
          <button
            type="button"
            className="programmes-pill"
            id="programmesBtn"
            onClick={onOpenProgrammes}
          >
            {programmesLabel}
          </button>
        </div>
      )}
    </main>
  );
}
