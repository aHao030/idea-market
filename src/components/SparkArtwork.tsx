interface SparkArtworkProps {
  variant?: number;
  large?: boolean;
}

const tones = [
  { bg: '#009147', ink: '#f6dd38', secondary: '#ffffff' },
  { bg: '#f6dd38', ink: '#009147', secondary: '#101a14' },
  { bg: '#101a14', ink: '#f6dd38', secondary: '#69bc45' },
  { bg: '#ffffff', ink: '#009147', secondary: '#f6dd38' },
  { bg: '#69bc45', ink: '#101a14', secondary: '#f6dd38' },
  { bg: '#009147', ink: '#ffffff', secondary: '#f6dd38' },
];

export function SparkArtwork({ variant = 0, large = false }: SparkArtworkProps) {
  const tone = tones[variant % tones.length];
  const rotation = (variant * 17) % 45;
  const id = `spark-${variant}-${large ? 'large' : 'card'}`;
  return (
    <div className={`spark-artwork ${large ? 'spark-artwork--large' : ''}`} style={{ background: tone.bg }} aria-hidden="true">
      <svg viewBox="0 0 520 300" role="presentation">
        <defs>
          <pattern id={id} width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill={tone.ink} opacity="0.22" />
          </pattern>
        </defs>
        <rect width="520" height="300" fill={`url(#${id})`} />
        <circle cx={420 - variant * 9} cy={48 + variant * 7} r={94 - variant * 4} fill="none" stroke={tone.secondary} strokeWidth="1.4" opacity="0.55" />
        <circle cx={420 - variant * 9} cy={48 + variant * 7} r={58 + variant * 2} fill="none" stroke={tone.secondary} strokeWidth="1.4" opacity="0.35" />
        <path d={`M ${52 + variant * 6} 248 C 130 ${160 - variant * 5}, 250 ${280 - variant * 8}, 472 ${172 + variant * 4}`} fill="none" stroke={tone.secondary} strokeWidth="2" strokeDasharray="5 9" opacity="0.75" />
        <g transform={`translate(${large ? 258 : 238} 146) rotate(${rotation})`}>
          <path d="M0-98 17-28 73-73 36-13 105 0 36 13 73 73 17 28 0 98-17 28-73 73-36 13-105 0-36-13-73-73-17-28Z" fill={tone.ink} />
          <circle r="25" fill={tone.bg} />
          <circle r="11" fill={tone.secondary} />
        </g>
        <text x="26" y="42" fill={tone.secondary} fontSize="12" fontWeight="700" letterSpacing="3">IDEA / {String(variant + 1).padStart(2, '0')}</text>
        <text x="28" y="276" fill={tone.secondary} fontSize="11" fontWeight="600" letterSpacing="2">A SMALL SPARK, A REAL NEXT STEP</text>
      </svg>
    </div>
  );
}
