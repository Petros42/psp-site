import { useCallback, useEffect, useRef, type MouseEvent } from 'react';

interface LogoCardProps {
  onTripleClick?: () => void;
}

export function LogoCard({ onTripleClick }: LogoCardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const clickTimestampsRef = useRef<number[]>([]);
  const replayTimerRef = useRef<number | null>(null);

  const replayLogoAnimation = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const animatedEls = svg.querySelectorAll<SVGGElement>(
      '.anim-black-crescent, .anim-gold-crescent, .anim-psp-letters, .anim-light-sweep'
    );
    animatedEls.forEach((el) => {
      el.style.animation = 'none';
    });
    void svg.getBoundingClientRect();
    animatedEls.forEach((el) => {
      el.style.animation = '';
    });
  }, []);

  useEffect(() => {
    replayLogoAnimation();

    if (document.hidden) {
      const onFirstVisible = () => {
        if (!document.hidden) {
          document.removeEventListener('visibilitychange', onFirstVisible);
          replayLogoAnimation();
        }
      };
      document.addEventListener('visibilitychange', onFirstVisible);
      return () => {
        document.removeEventListener('visibilitychange', onFirstVisible);
      };
    }
  }, [replayLogoAnimation]);

  useEffect(() => {
    return () => {
      if (replayTimerRef.current !== null) {
        window.clearTimeout(replayTimerRef.current);
      }
    };
  }, []);

  const handleLogoClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      const recent = clickTimestampsRef.current.filter((t) => now - t <= 600);
      recent.push(now);
      clickTimestampsRef.current = recent;

      if (replayTimerRef.current !== null) {
        window.clearTimeout(replayTimerRef.current);
        replayTimerRef.current = null;
      }

      if (recent.length >= 3) {
        clickTimestampsRef.current = [];
        onTripleClick?.();
        return;
      }

      replayTimerRef.current = window.setTimeout(() => {
        replayTimerRef.current = null;
        replayLogoAnimation();
      }, 300);
    },
    [onTripleClick, replayLogoAnimation]
  );

  return (
    <div className="logo-card-wrap" onClick={handleLogoClick}>
      <svg
        ref={svgRef}
        className="logo-svg"
        viewBox="0 0 960 640"
        width="960"
        height="640"
        role="img"
        aria-label="PSP — Process Stage Praxis Logo"
      >
        <defs>
          {/* Soft radial blush-terracotta card surface */}
          <radialGradient id="cardWarmGlow" cx="50%" cy="48%" r="58%">
            <stop offset="0%" stopColor="#F6ECE4" />
            <stop offset="100%" stopColor="#EDE0D5" />
          </radialGradient>

          {/* Dual-layer sculptural 3D shadow for matte-black crescent */}
          <filter id="blackCrescentShadow" x="-30%" y="-30%" width="170%" height="175%">
            <feDropShadow dx="-8" dy="16" stdDeviation="16" floodColor="#161514" floodOpacity="0.46" />
            <feDropShadow dx="-14" dy="26" stdDeviation="26" floodColor="#161514" floodOpacity="0.22" />
          </filter>

          {/* Larger, deeper sculptural 3D shadow for gold crescent */}
          <filter id="goldCrescentShadow" x="-35%" y="-35%" width="180%" height="185%">
            <feDropShadow dx="-11" dy="21" stdDeviation="20" floodColor="#1A120B" floodOpacity="0.52" />
            <feDropShadow dx="-18" dy="32" stdDeviation="32" floodColor="#1A120B" floodOpacity="0.26" />
          </filter>

          {/* Subtle sculptural rim shading for black crescent */}
          <linearGradient id="blackCrescentGrad" x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#262422" />
            <stop offset="55%" stopColor="#161514" />
            <stop offset="100%" stopColor="#0B0A09" />
          </linearGradient>

          {/* Flat warm golden-yellow with subtle dimensional lower rim */}
          <linearGradient id="goldCrescentGrad" x1="20%" y1="12%" x2="82%" y2="88%">
            <stop offset="0%" stopColor="#FFB319" />
            <stop offset="60%" stopColor="#F9A602" />
            <stop offset="100%" stopColor="#E29200" />
          </linearGradient>

          {/* Single diagonal white light sweep */}
          <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Card Ground */}
        <rect x="0" y="0" width="960" height="640" fill="url(#cardWarmGlow)" />

        {/* 1. Left Matte-Black Crescent (0.00s - 1.75s) */}
        <g className="anim-black-crescent">
          <path
            filter="url(#blackCrescentShadow)"
            d="M 605 112 C 390 100, 178 216, 175 360 C 173 458, 294 504, 480 426 C 345 452, 268 412, 270 336 C 272 232, 418 145, 605 112 Z"
            fill="url(#blackCrescentGrad)"
          />
        </g>

        {/* 2. Right Gold Crescent with Larger 3D Shadow (1.75s - 3.05s) */}
        <g className="anim-gold-crescent">
          <path
            filter="url(#goldCrescentShadow)"
            d="M 315 524 C 542 542, 774 422, 778 274 C 780 172, 650 124, 456 206 C 598 178, 678 220, 676 298 C 674 404, 514 492, 315 524 Z"
            fill="url(#goldCrescentGrad)"
          />
        </g>

        {/* 3. Pure Solid Matte-Black PSP Lettering (3.05s - 4.35s, zero shadow) */}
        <g className="anim-psp-letters">
          <text
            x="478"
            y="346"
            textAnchor="middle"
            fill="#161514"
            fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            fontSize="82"
            fontWeight="500"
            letterSpacing="18"
          >
            PSP
          </text>
        </g>

        {/* 4. Single Diagonal White Light Sweep (4.35s - 5.45s) */}
        <g className="anim-light-sweep">
          <polygon points="-140,-80 120,-80 -120,720 -380,720" fill="url(#sweepGrad)" />
        </g>
      </svg>
    </div>
  );
}
