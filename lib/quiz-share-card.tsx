// Server-only JSX used by opengraph-image.tsx and the /api/quiz/share-image
// route to render quiz result cards via next/og's ImageResponse (satori).
// Satori only supports a constrained CSS subset: flexbox layout, and any
// element with more than one child needs an explicit `display: flex`.
// IMPORTANT: callers must pass `{ emoji: 'twemoji' }` to ImageResponse or
// emoji render as flat monochrome glyphs instead of full color.
//
// Visual identity mirrors HeroSection.tsx (the site's actual brand
// treatment): a diagonal navy gradient base, soft green/yellow glow
// blobs (radial-gradient, not hard-edged shapes), a glassy translucent
// white badge, and a solid-green CTA button — not an invented palette.

const NAVY_DARK = '#001a5c'
const NAVY = '#002776'
const NAVY_LIGHT = '#003a99'
const BRAND_GREEN = '#009C3B'
const BRAND_YELLOW = '#FFDF00'

interface ShareCardResult {
  title: string
  icon: string | null
  subtitle: string | null
}

function Glow({ size, top, left, right, bottom, color, alpha }: {
  size: number; top?: number; left?: number; right?: number; bottom?: number; color: string; alpha: string
}) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        display: 'flex',
        backgroundImage: `radial-gradient(circle, ${color}${alpha} 0%, ${color}00 70%)`,
        ...(top !== undefined ? { top } : {}),
        ...(left !== undefined ? { left } : {}),
        ...(right !== undefined ? { right } : {}),
        ...(bottom !== undefined ? { bottom } : {}),
      }}
    />
  )
}

const DOT_PATTERN =
  "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

export function VerticalShareCard({
  result,
  quizTitle,
  width,
  height,
}: {
  result: ShareCardResult
  quizTitle: string
  width: number
  height: number
}) {
  const s = width / 1080

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 50%, ${NAVY_LIGHT} 100%)`,
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soft glows — same language as the site's Hero section */}
      <Glow size={760 * s} top={-260 * s} right={-260 * s} color={BRAND_GREEN} alpha="55" />
      <Glow size={560 * s} bottom={140 * s} left={-220 * s} color={BRAND_GREEN} alpha="40" />
      <Glow size={640 * s} top={height * 0.34} left={width * 0.5 - 320 * s} color={BRAND_YELLOW} alpha="26" />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', opacity: 0.04, backgroundImage: `url("${DOT_PATTERN}")` }} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: `${58 * s}px ${64 * s}px` }}>
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 * s }}>
          <span style={{ fontSize: 36 * s, display: 'flex' }}>🇧🇷</span>
          <span style={{ fontSize: 30 * s, fontWeight: 800, color: 'white', display: 'flex' }}>
            BRASIL<span style={{ color: BRAND_YELLOW }}>BCN</span>
          </span>
        </div>

        {/* Glass badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8 * s,
            backgroundColor: 'rgba(255,255,255,0.14)',
            border: `${2 * s}px solid rgba(255,255,255,0.3)`,
            borderRadius: 999,
            padding: `${10 * s}px ${22 * s}px`,
            marginTop: 30 * s,
            alignSelf: 'flex-start',
          }}
        >
          <span style={{ fontSize: 22 * s, display: 'flex' }}>✨</span>
          <span style={{ fontSize: 21 * s, fontWeight: 700, color: 'white', letterSpacing: 2, display: 'flex' }}>
            QUIZ DA SEMANA
          </span>
        </div>

        <div style={{ display: 'flex', marginTop: 24 * s }}>
          <span style={{ fontSize: 26 * s, fontWeight: 700, color: 'rgba(255,255,255,0.7)', lineHeight: 1.3, display: 'flex' }}>
            {quizTitle.toUpperCase()}
          </span>
        </div>

        {/* Result block */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
          <div
            style={{
              display: 'flex',
              width: 216 * s,
              height: 216 * s,
              borderRadius: 9999,
              backgroundColor: 'rgba(255,255,255,0.14)',
              border: `${2 * s}px solid rgba(255,255,255,0.25)`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 36 * s,
            }}
          >
            <span style={{ fontSize: 116 * s, display: 'flex' }}>{result.icon ?? '🇧🇷'}</span>
          </div>
          <span style={{ fontSize: 78 * s, fontWeight: 900, color: 'white', lineHeight: 1.04, display: 'flex' }}>
            {result.title.toUpperCase()}
          </span>
          {result.subtitle && (
            <span style={{ fontSize: 32 * s, color: 'rgba(198,219,255,0.9)', marginTop: 28 * s, lineHeight: 1.4, display: 'flex' }}>
              &ldquo;{result.subtitle}&rdquo;
            </span>
          )}
        </div>

        {/* CTA — same treatment as the Hero's primary button: solid green, white text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: BRAND_GREEN,
            borderRadius: 36 * s,
            padding: `${34 * s}px ${40 * s}px`,
          }}
        >
          <span style={{ fontSize: 27 * s, color: 'rgba(255,255,255,0.85)', display: 'flex' }}>E você? 👀</span>
          <span style={{ fontSize: 46 * s, fontWeight: 900, color: 'white', display: 'flex', marginTop: 6 * s }}>
            FAÇA O QUIZ
          </span>
          <span style={{ fontSize: 27 * s, color: BRAND_YELLOW, fontWeight: 700, marginTop: 10 * s, display: 'flex' }}>
            brasilbcn.com/quiz
          </span>
        </div>
      </div>
    </div>
  )
}

export function HorizontalShareCard({ result, quizTitle }: { result: ShareCardResult; quizTitle: string }) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        backgroundImage: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY} 50%, ${NAVY_LIGHT} 100%)`,
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Glow size={680} top={-240} right={-200} color={BRAND_GREEN} alpha="55" />
      <Glow size={480} bottom={-160} left={80} color={BRAND_GREEN} alpha="35" />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', opacity: 0.04, backgroundImage: `url("${DOT_PATTERN}")` }} />

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px 64px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26, display: 'flex' }}>🇧🇷</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'white', display: 'flex' }}>
            BRASIL<span style={{ color: BRAND_YELLOW }}>BCN</span>
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(255,255,255,0.14)',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 999,
            padding: '8px 18px',
            marginTop: 22,
            alignSelf: 'flex-start',
          }}
        >
          <span style={{ fontSize: 15, display: 'flex' }}>✨</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'white', letterSpacing: 2, display: 'flex', maxWidth: 480 }}>
            QUIZ DA SEMANA · {(quizTitle.length > 34 ? `${quizTitle.slice(0, 34)}…` : quizTitle).toUpperCase()}
          </span>
        </div>
        <span style={{ fontSize: 52, fontWeight: 900, color: 'white', marginTop: 26, lineHeight: 1.08, display: 'flex', maxWidth: 620 }}>
          {result.title}
        </span>
        {result.subtitle && (
          <span style={{ fontSize: 21, color: 'rgba(198,219,255,0.9)', marginTop: 16, display: 'flex', maxWidth: 520, lineHeight: 1.4 }}>
            {result.subtitle}
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 30 }}>
          <span style={{ fontSize: 20, display: 'flex' }}>👉</span>
          <span style={{ fontSize: 20, color: BRAND_YELLOW, fontWeight: 800, display: 'flex' }}>brasilbcn.com/quiz</span>
        </div>
      </div>
      <div style={{ width: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            width: 250,
            height: 250,
            borderRadius: 9999,
            backgroundColor: 'rgba(255,255,255,0.14)',
            border: '2px solid rgba(255,255,255,0.25)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 136, display: 'flex' }}>{result.icon ?? '🇧🇷'}</span>
        </div>
      </div>
    </div>
  )
}
