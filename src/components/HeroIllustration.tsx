// Placeholder artwork. Replace with a real photograph of solar panels in an
// African landscape (for example with next/image) when one is available.
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 560 420"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Rows of solar panels on highland hills under a rising sun"
      className="block h-full w-full"
    >
      <rect width="560" height="420" fill="#F7D27A" />
      <circle cx="380" cy="150" r="70" fill="#F5B301" />
      <circle cx="380" cy="150" r="100" fill="none" stroke="#F5B301" strokeWidth="2" opacity="0.5" />
      <path d="M0 230 Q120 170 240 215 T560 190 V420 H0Z" fill="#7FA36B" />
      <path d="M0 270 Q160 225 300 262 T560 245 V420 H0Z" fill="#4F7F52" />
      <g fill="#2C4A36">
        <rect x="470" y="190" width="5" height="45" />
        <path d="M440 195 Q472 172 505 195 Q472 186 440 195Z" />
      </g>
      <path d="M0 310 Q200 285 560 305 V420 H0Z" fill="#2F5D45" />
      <g stroke="#9FB8D6" strokeWidth="1">
        <g fill="#1E3A5F">
          <path d="M40 330 L150 330 L135 300 L60 300Z" />
          <path d="M170 330 L280 330 L265 300 L190 300Z" />
          <path d="M300 330 L410 330 L395 300 L320 300Z" />
          <path d="M430 330 L540 330 L525 300 L450 300Z" />
        </g>
        <g fill="#24466F">
          <path d="M20 395 L160 395 L142 352 L45 352Z" />
          <path d="M185 395 L325 395 L307 352 L210 352Z" />
          <path d="M350 395 L490 395 L472 352 L375 352Z" />
        </g>
        <path
          fill="none"
          d="M97 300 L95 330M227 300 L225 330M357 300 L355 330M487 300 L485 330M50 315 L142 315M180 315 L272 315M310 315 L402 315M440 315 L532 315M93 352 L90 395M258 352 L255 395M423 352 L420 395M32 373 L151 373M197 373 L316 373M362 373 L481 373"
        />
      </g>
    </svg>
  );
}
