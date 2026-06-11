'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'full' | 'compact' | 'icon'
type Theme = 'default' | 'white'

interface BrandLogoProps {
  variant?: Variant
  theme?: Theme
  className?: string
}

const PIN = 'M50,0 C22.4,0 0,22.4 0,50 C0,77.6 50,128 50,128 C50,128 100,77.6 100,50 C100,22.4 77.6,0 50,0Z'

const TILES_R1: [number, number, string, number][] = [
  [1,73,'#2E8B57',-4],[11,72,'#009C3B',3],[21,73,'#0047AB',-2],[31,72,'#1ABC9C',4],
  [41,73,'#2E8B57',-3],[51,72,'#4ECDC4',2],[61,73,'#0047AB',-4],[71,72,'#009C3B',3],[81,73,'#1ABC9C',-2],
]
const TILES_R2: [number, number, string, number][] = [
  [4,79,'#4ECDC4',3],[14,78,'#2E8B57',-3],[24,79,'#009C3B',2],[34,78,'#0047AB',-4],
  [44,79,'#1ABC9C',3],[54,78,'#2E8B57',-2],[64,79,'#009C3B',4],[74,78,'#4ECDC4',-3],[84,79,'#0047AB',2],
]

function PinInterior({ clipId }: { clipId: string }) {
  return (
    <g clipPath={`url(#${clipId})`}>
      {/* Sky */}
      <rect x="0" y="0" width="100" height="55" fill="#001a5c" />

      {/* ── Sagrada Família ── */}
      {/* Left main spire */}
      <rect x="43" y="20" width="5" height="35" fill="white" fillOpacity="0.95" />
      <polygon points="40,20 45.5,10 51,20" fill="white" fillOpacity="0.95" />
      <polygon points="45.5,10 43,14 48,14" fill="#FFDF00" fillOpacity="0.9" />
      {/* Right main spire */}
      <rect x="52" y="22" width="5" height="33" fill="white" fillOpacity="0.95" />
      <polygon points="49,22 54.5,12 60,22" fill="white" fillOpacity="0.95" />
      <polygon points="54.5,12 52,16 57,16" fill="#FFDF00" fillOpacity="0.9" />
      {/* Left secondary spire */}
      <rect x="31" y="28" width="4.5" height="27" fill="white" fillOpacity="0.82" />
      <polygon points="29,28 33.25,20 37.5,28" fill="white" fillOpacity="0.82" />
      {/* Right secondary spire */}
      <rect x="64.5" y="28" width="4.5" height="27" fill="white" fillOpacity="0.82" />
      <polygon points="62.5,28 66.75,20 71,28" fill="white" fillOpacity="0.82" />
      {/* Left outer spire */}
      <rect x="21" y="34" width="3.5" height="21" fill="white" fillOpacity="0.6" />
      <polygon points="19.5,34 22.75,28 26,34" fill="white" fillOpacity="0.6" />
      {/* Connecting facade */}
      <rect x="19" y="45" width="57" height="10" fill="white" fillOpacity="0.35" />

      {/* Torre Glòries (right skyline) */}
      <path d="M80,55 L80,33 C80,27 88,27 88,33 L88,55 Z" fill="white" fillOpacity="0.42" />
      <ellipse cx="84" cy="26" rx="4" ry="4" fill="white" fillOpacity="0.42" />

      {/* Hotel Vela W (left, sail shape) */}
      <path d="M8,55 L8,38 C14,40 15,49 15,55 Z" fill="white" fillOpacity="0.36" />

      {/* Birds */}
      <path d="M21,16 Q23,13 25,16" stroke="white" strokeWidth="0.7" fill="none" strokeOpacity="0.6" />
      <path d="M27,12 Q29,9 31,12" stroke="white" strokeWidth="0.7" fill="none" strokeOpacity="0.6" />
      <path d="M34,17 Q36,14 38,17" stroke="white" strokeWidth="0.7" fill="none" strokeOpacity="0.45" />

      {/* ── Brazilian waves ── */}
      <path
        d="M0,55 Q12.5,52 25,55 Q37.5,58 50,55 Q62.5,52 75,55 Q87.5,58 100,55 L100,67 L0,67 Z"
        fill="#009C3B"
      />
      <rect x="0" y="67" width="100" height="6" fill="#FFDF00" />

      {/* ── Trencadís mosaic ── */}
      <rect x="0" y="73" width="100" height="13" fill="#3ABFBF" />
      {TILES_R1.map(([x, y, fill, r], i) => (
        <rect key={`r1-${i}`} x={x} y={y} width="9" height="5" rx="0.8" fill={fill} transform={`rotate(${r},${x + 4.5},${y + 2.5})`} />
      ))}
      {TILES_R2.map(([x, y, fill, r], i) => (
        <rect key={`r2-${i}`} x={x} y={y} width="9" height="5" rx="0.8" fill={fill} transform={`rotate(${r},${x + 4.5},${y + 2.5})`} />
      ))}
    </g>
  )
}

export function BrandLogo({ variant = 'full', theme = 'default', className }: BrandLogoProps) {
  const uid = useId().replace(/:/g, '')
  const clipId = `bc-${uid}`
  const isWhite = theme === 'white'

  const defs = (
    <defs>
      <clipPath id={clipId}>
        <circle cx="50" cy="43" r="42" />
      </clipPath>
    </defs>
  )

  const pinMark = (
    <g>
      <path d={PIN} fill="#002776" />
      <PinInterior clipId={clipId} />
      <path d={PIN} fill="none" stroke="#001248" strokeWidth="2" />
    </g>
  )

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 100 128"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Brasil BCN"
        className={cn('w-auto', className)}
      >
        {defs}
        {pinMark}
      </svg>
    )
  }

  const tGreen  = isWhite ? 'white'                    : '#009C3B'
  const tBlue   = isWhite ? 'white'                    : '#002776'
  const tMuted  = isWhite ? 'rgba(255,255,255,0.7)'    : '#6B7280'
  const lGold   = isWhite ? 'rgba(255,255,255,0.35)'   : '#C9A400'
  const lGreen  = isWhite ? 'rgba(255,255,255,0.35)'   : '#009C3B'
  const dFill   = isWhite ? 'rgba(255,255,255,0.45)'   : '#FFDF00'
  const dStroke = isWhite ? 'rgba(255,255,255,0.2)'    : '#002776'

  return (
    <svg
      viewBox="0 0 460 128"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Brasil BCN"
      className={cn('w-auto', className)}
    >
      {defs}

      {/* Pin mark */}
      {pinMark}

      {/* Wordmark */}
      <text
        fontFamily="'Montserrat','Arial Black',sans-serif"
        fontWeight="900"
        fontSize="62"
      >
        <tspan x="116" y={variant === 'full' ? '72' : '80'} fill={tGreen}>Brasil</tspan>
        <tspan fill={tBlue}> BCN</tspan>
      </text>

      {variant === 'full' && (
        <>
          {/* Tagline */}
          <text
            x="118"
            y="92"
            fontFamily="'Montserrat',sans-serif"
            fontSize="12"
            fill={tMuted}
            letterSpacing="0.5"
          >
            A comunidade brasileira em Barcelona
          </text>

          {/* Ornament divider */}
          <line x1="118" y1="107" x2="216" y2="107" stroke={lGold} strokeWidth="1.5" />
          <polygon points="220,103 225,107 220,111 215,107" fill={dFill} stroke={dStroke} strokeWidth="0.4" />
          <circle cx="220" cy="107" r="1.2" fill={dStroke} />
          <line x1="230" y1="107" x2="370" y2="107" stroke={lGreen} strokeWidth="1.5" />
        </>
      )}
    </svg>
  )
}
