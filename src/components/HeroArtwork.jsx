// CHANGE VERSION: HERO-PLAYGROUND-R4 | 2026-10-16 | Complete HeroArtwork.jsx

// These illustrations are decoration only. The outer wrapper retains the hero's
// pointer offsets; all geometry lives inside the SVG and never moves the copy.
function LinkBand({ d, color }) {
  return <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke="var(--print-paper)" strokeWidth="44" />
    <path d={d} stroke="var(--print-ink)" strokeWidth="35" />
    <path d={d} stroke={color} strokeWidth="29" />
  </g>;
}

export default function HeroArtwork({ number }) {
  const patternId = 'hero-print-dots-' + number;
  return <div className={'hero-print-art hero-collage hero-print-art-' + number} aria-hidden="true">
    <svg className="hero-print-art-svg" viewBox="0 0 320 350" focusable="false">
      {number === 1 && <>
        <defs><pattern id={patternId} width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.05" fill="currentColor" /></pattern></defs>
        <g>
          <path className="hero-collage-sheet" d="m50 173 212-26 19 154-214 26Z" />
          <path className="hero-collage-sheet-line" d="m72 241 176-22m-172 42 131-16m-127 36 161-20" />
          <path className="hero-print-art-dots" d="m70 175 181-21 7 56-180 20Z" fill={'url(#' + patternId + ')'} />
          <g className="hero-collage-burst">
            <path className="hero-print-art-white-stroke" d="m151 27 20 44 43-30-3 52 52-3-29 42 43 22-48 19 22 46-51-8-4 51-35-37-35 37-4-51-51 8 22-46-48-19 43-22-29-42 52 3-3-52 43 30Z" />
            <path className="hero-print-art-star" d="m151 27 20 44 43-30-3 52 52-3-29 42 43 22-48 19 22 46-51-8-4 51-35-37-35 37-4-51-51 8 22-46-48-19 43-22-29-42 52 3-3-52 43 30Z" />
            <path className="hero-collage-code" d="m122 116-32 28 32 28m64-56 32 28-32 28m-25-67-21 78" />
          </g>
        </g>
      </>}
      {number === 2 && <g className="hero-collage-creative" strokeLinecap="round" strokeLinejoin="round">
        <path d="M45 146C82 31 237 46 273 176" fill="none" stroke="var(--print-paper)" strokeWidth="3" strokeDasharray="3 9" />
        <path d="M46 146 86 73m151 33 36 70" fill="none" stroke="var(--print-paper)" strokeWidth="2" />
        <g fill="var(--print-paper)" stroke="var(--print-ink)" strokeWidth="2">
          <rect x="39" y="139" width="14" height="14" rx="2" />
          <rect x="79" y="66" width="14" height="14" rx="2" />
          <rect x="230" y="99" width="14" height="14" rx="2" />
          <rect x="266" y="169" width="14" height="14" rx="2" />
        </g>
        <circle cx="151" cy="180" r="78" fill="var(--coral)" stroke="var(--print-paper)" strokeWidth="11" />
        <circle cx="151" cy="180" r="78" fill="none" stroke="var(--print-ink)" strokeWidth="3" />
        <circle cx="226" cy="105" r="36" fill="var(--amber)" stroke="var(--print-paper)" strokeWidth="10" />
        <circle cx="226" cy="105" r="36" fill="none" stroke="var(--print-ink)" strokeWidth="3" />
        <path d="m215 105 7 7 16-18" fill="none" stroke="var(--print-ink)" strokeWidth="3" />
        <g transform="rotate(12 146 267)">
          <rect x="75" y="243" width="142" height="48" rx="24" fill="var(--blue)" stroke="var(--print-paper)" strokeWidth="10" />
          <rect x="75" y="243" width="142" height="48" rx="24" fill="none" stroke="var(--print-ink)" strokeWidth="3" />
          <path d="M96 267h98" fill="none" stroke="var(--print-ink)" strokeWidth="2" strokeDasharray="2 8" />
        </g>
        <g transform="rotate(-12 162 191)">
          <path d="m108 92 10 161 40-37 28 54 30-15-27-51 58-7Z" fill="var(--print-paper)" stroke="var(--print-paper)" strokeWidth="12" />
          <path d="m108 92 10 161 40-37 28 54 30-15-27-51 58-7Z" fill="var(--print-paper)" stroke="var(--print-ink)" strokeWidth="3" />
          <path d="m123 125 7 99 25-24" fill="none" stroke="var(--blue)" strokeWidth="3" />
        </g>
        <path d="m51 235 8 12 14-3-9 11 5 13-13-5-11 9 2-14-11-8 14-2Z" fill="var(--amber)" stroke="var(--print-ink)" strokeWidth="2" />
        <path d="m259 237 2 20m-11-9 20-2" fill="none" stroke="var(--print-paper)" strokeWidth="3" />
      </g>}
      {number === 3 && <g className="hero-collage-connected">
        <path d="M53 73C-2 139 27 252 107 294m151-193c61 66 35 153-28 190" fill="none" stroke="var(--print-paper)" strokeWidth="2" strokeDasharray="3 9" strokeLinecap="round" opacity=".7" />
        <g transform="rotate(-27 107 133)">
          <LinkBand d="M107 57a44 44 0 0 1 44 44v64a44 44 0 0 1-88 0v-64a44 44 0 0 1 44-44Z" color="var(--blue)" />
        </g>
        <g transform="rotate(29 215 159)">
          <LinkBand d="M215 81a42 42 0 0 1 42 42v72a42 42 0 0 1-84 0v-72a42 42 0 0 1 42-42Z" color="var(--coral)" />
        </g>
        <g transform="rotate(-12 163 237)">
          <LinkBand d="M112 197h102a40 40 0 0 1 0 80H112a40 40 0 0 1 0-80Z" color="var(--amber)" />
          <path d="M111 185h45" fill="none" stroke="var(--print-paper)" strokeWidth="3" strokeLinecap="round" />
        </g>
        <path d="m43 210 6 12 13 2-10 9 2 13-12-6-12 6 2-13-9-9 13-2Z" fill="var(--coral)" stroke="var(--print-ink)" strokeWidth="2" strokeLinejoin="round" />
        <path d="m259 43 6 12 13 2-10 9 2 13-12-6-12 6 2-13-9-9 13-2Z" fill="var(--amber)" stroke="var(--print-ink)" strokeWidth="2" strokeLinejoin="round" />
        <path d="m286 262 1 19m-10-10 19 1M55 43l2 15m-9-7 16-1" fill="none" stroke="var(--print-paper)" strokeWidth="3" strokeLinecap="round" />
      </g>}
    </svg>
    <svg className="hero-print-art-orbit" viewBox="0 0 360 120" focusable="false"><path d="M44 86C-4 31 143-5 248 17s111 67 26 74-140-35-73-55" /><path d="m198 29 11 5-6 12" /><path d="m318 63 2-11m-7 6 12-1" /></svg>
  </div>;
}

// END OF FILE: HERO-PLAYGROUND-R4 | HeroArtwork.jsx
