// Server-only JSX used by opengraph-image.tsx and the /api/quiz/share-image
// route to render quiz result cards via next/og's ImageResponse (satori).
// Satori only supports a constrained CSS subset: flexbox layout, and any
// element with more than one child needs an explicit `display: flex`.

const BRAND_BLUE = '#002776'
const BRAND_GREEN = '#009C3B'
const BRAND_YELLOW = '#FFDF00'

interface ShareCardResult {
  title: string
  icon: string | null
  subtitle: string | null
}

function Blob({ size, top, left, right, bottom, color, opacity }: {
  size: number; top?: number; left?: number; right?: number; bottom?: number; color: string; opacity: number
}) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: 9999,
        backgroundColor: color,
        opacity,
        display: 'flex',
        ...(top !== undefined ? { top } : {}),
        ...(left !== undefined ? { left } : {}),
        ...(right !== undefined ? { right } : {}),
        ...(bottom !== undefined ? { bottom } : {}),
      }}
    />
  )
}

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
        backgroundColor: BRAND_BLUE,
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Playful decorative shapes */}
      <Blob size={480 * s} top={-160 * s} right={-140 * s} color={BRAND_GREEN} opacity={0.4} />
      <Blob size={380 * s} bottom={280 * s} left={-160 * s} color={BRAND_YELLOW} opacity={0.22} />
      <Blob size={140 * s} top={height * 0.42} right={-40 * s} color="#ffffff" opacity={0.08} />
      <Blob size={620 * s} bottom={-260 * s} right={-180 * s} color={BRAND_GREEN} opacity={0.18} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: `${60 * s}px ${68 * s}px` }}>
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 * s }}>
          <span style={{ fontSize: 38 * s, display: 'flex' }}>🇧🇷</span>
          <span style={{ fontSize: 32 * s, fontWeight: 800, color: 'white', display: 'flex' }}>
            BRASIL<span style={{ color: BRAND_GREEN }}>BCN</span>
          </span>
        </div>

        {/* Badge pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8 * s,
            backgroundColor: BRAND_YELLOW,
            borderRadius: 999,
            padding: `${10 * s}px ${22 * s}px`,
            marginTop: 28 * s,
            alignSelf: 'flex-start',
          }}
        >
          <span style={{ fontSize: 24 * s, display: 'flex' }}>✨</span>
          <span style={{ fontSize: 22 * s, fontWeight: 800, color: '#3a2f00', letterSpacing: 2, display: 'flex' }}>
            QUIZ DA SEMANA
          </span>
        </div>

        <div style={{ display: 'flex', marginTop: 26 * s }}>
          <span style={{ fontSize: 28 * s, fontWeight: 700, color: 'rgba(255,255,255,0.8)', lineHeight: 1.3, display: 'flex' }}>
            {quizTitle.toUpperCase()}
          </span>
        </div>

        {/* Result block */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
          <div
            style={{
              display: 'flex',
              width: 220 * s,
              height: 220 * s,
              borderRadius: 9999,
              backgroundColor: 'rgba(255,255,255,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 32 * s,
            }}
          >
            <span style={{ fontSize: 128 * s, display: 'flex' }}>{result.icon ?? '🇧🇷'}</span>
          </div>
          <span style={{ fontSize: 76 * s, fontWeight: 900, color: 'white', lineHeight: 1.05, display: 'flex' }}>
            {result.title.toUpperCase()}
          </span>
          {result.subtitle && (
            <span style={{ fontSize: 32 * s, color: 'rgba(255,255,255,0.8)', marginTop: 26 * s, lineHeight: 1.4, display: 'flex' }}>
              &ldquo;{result.subtitle}&rdquo;
            </span>
          )}
        </div>

        {/* CTA sticker */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: BRAND_GREEN,
            borderRadius: 36 * s,
            padding: `${34 * s}px ${40 * s}px`,
          }}
        >
          <span style={{ fontSize: 28 * s, color: 'rgba(255,255,255,0.9)', display: 'flex' }}>E você? 👀</span>
          <span style={{ fontSize: 46 * s, fontWeight: 900, color: 'white', display: 'flex', marginTop: 6 * s }}>
            FAÇA O QUIZ
          </span>
          <span style={{ fontSize: 28 * s, color: 'white', fontWeight: 700, marginTop: 10 * s, display: 'flex' }}>
            brasilbcn.com/quiz
          </span>
        </div>
      </div>
    </div>
  )
}

export function HorizontalShareCard({ result, quizTitle }: { result: ShareCardResult; quizTitle: string }) {
  return (
    <div style={{ width: 1200, height: 630, display: 'flex', backgroundColor: BRAND_BLUE, fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden' }}>
      <Blob size={420} top={-140} right={-100} color={BRAND_GREEN} opacity={0.35} />
      <Blob size={320} bottom={-140} left={200} color={BRAND_YELLOW} opacity={0.16} />

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px 64px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28, display: 'flex' }}>🇧🇷</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: 'white', display: 'flex' }}>
            BRASIL<span style={{ color: BRAND_GREEN }}>BCN</span>
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: BRAND_YELLOW,
            borderRadius: 999,
            padding: '8px 18px',
            marginTop: 22,
            alignSelf: 'flex-start',
          }}
        >
          <span style={{ fontSize: 16, display: 'flex' }}>✨</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#3a2f00', letterSpacing: 2, display: 'flex', maxWidth: 500 }}>
            QUIZ DA SEMANA · {(quizTitle.length > 34 ? `${quizTitle.slice(0, 34)}…` : quizTitle).toUpperCase()}
          </span>
        </div>
        <span style={{ fontSize: 54, fontWeight: 900, color: 'white', marginTop: 26, lineHeight: 1.1, display: 'flex', maxWidth: 640 }}>
          {result.title}
        </span>
        {result.subtitle && (
          <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.75)', marginTop: 16, display: 'flex', maxWidth: 520, lineHeight: 1.4 }}>
            {result.subtitle}
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 30 }}>
          <span style={{ fontSize: 20, display: 'flex' }}>👉</span>
          <span style={{ fontSize: 20, color: BRAND_GREEN, fontWeight: 800, display: 'flex' }}>brasilbcn.com/quiz</span>
        </div>
      </div>
      <div style={{ width: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            width: 260,
            height: 260,
            borderRadius: 9999,
            backgroundColor: 'rgba(255,255,255,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 150, display: 'flex' }}>{result.icon ?? '🇧🇷'}</span>
        </div>
      </div>
    </div>
  )
}
