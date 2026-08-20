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
        padding: `${64 * s}px ${72 * s}px`,
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 * s }}>
        <span style={{ fontSize: 40 * s, display: 'flex' }}>🇧🇷</span>
        <span style={{ fontSize: 34 * s, fontWeight: 800, color: 'white', display: 'flex' }}>
          BRASIL<span style={{ color: BRAND_GREEN }}>BCN</span>
        </span>
      </div>

      <div style={{ display: 'flex', marginTop: 10 * s }}>
        <span style={{ fontSize: 24 * s, fontWeight: 700, letterSpacing: 4, color: BRAND_YELLOW, display: 'flex' }}>
          QUIZ DA SEMANA
        </span>
      </div>

      <div style={{ display: 'flex', marginTop: 44 * s }}>
        <span style={{ fontSize: 30 * s, fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1.3, display: 'flex' }}>
          {quizTitle.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 140 * s, marginBottom: 20 * s, display: 'flex' }}>{result.icon ?? '🇧🇷'}</span>
        <span style={{ fontSize: 74 * s, fontWeight: 900, color: 'white', lineHeight: 1.05, display: 'flex' }}>
          {result.title.toUpperCase()}
        </span>
        {result.subtitle && (
          <span style={{ fontSize: 32 * s, color: 'rgba(255,255,255,0.75)', marginTop: 28 * s, lineHeight: 1.4, display: 'flex' }}>
            &ldquo;{result.subtitle}&rdquo;
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid rgba(255,255,255,0.15)', paddingTop: 32 * s }}>
        <span style={{ fontSize: 26 * s, color: 'rgba(255,255,255,0.7)', display: 'flex' }}>E você?</span>
        <span style={{ fontSize: 40 * s, fontWeight: 900, color: BRAND_GREEN, display: 'flex', marginTop: 4 * s }}>
          FAÇA O QUIZ
        </span>
        <span style={{ fontSize: 28 * s, color: 'white', fontWeight: 600, marginTop: 8 * s, display: 'flex' }}>
          brasilbcn.com/quiz
        </span>
      </div>
    </div>
  )
}

export function HorizontalShareCard({ result, quizTitle }: { result: ShareCardResult; quizTitle: string }) {
  return (
    <div style={{ width: 1200, height: 630, display: 'flex', backgroundColor: BRAND_BLUE, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28, display: 'flex' }}>🇧🇷</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: 'white', display: 'flex' }}>
            BRASIL<span style={{ color: BRAND_GREEN }}>BCN</span>
          </span>
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3, color: BRAND_YELLOW, marginTop: 18, display: 'flex', maxWidth: 640 }}>
          QUIZ DA SEMANA · {(quizTitle.length > 40 ? `${quizTitle.slice(0, 40)}…` : quizTitle).toUpperCase()}
        </span>
        <span style={{ fontSize: 54, fontWeight: 900, color: 'white', marginTop: 22, lineHeight: 1.1, display: 'flex', maxWidth: 640 }}>
          {result.title}
        </span>
        {result.subtitle && (
          <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.75)', marginTop: 16, display: 'flex', maxWidth: 520, lineHeight: 1.4 }}>
            {result.subtitle}
          </span>
        )}
        <span style={{ fontSize: 20, color: BRAND_GREEN, fontWeight: 700, marginTop: 30, display: 'flex' }}>
          brasilbcn.com/quiz
        </span>
      </div>
      <div style={{ width: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: 170, display: 'flex' }}>{result.icon ?? '🇧🇷'}</span>
      </div>
    </div>
  )
}
