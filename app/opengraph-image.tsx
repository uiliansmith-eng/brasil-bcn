import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BrasilBCN — La comunidad brasileña en Barcelona'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #002776 0%, #001540 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10, background: '#009C3B', display: 'flex' }} />

        {/* Bottom accent bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 10, background: '#FFDF00', display: 'flex' }} />

        {/* Decorative circle */}
        <div style={{
          position: 'absolute', right: -80, top: -80,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'rgba(255, 223, 0, 0.07)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', left: -60, bottom: -60,
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'rgba(0, 156, 59, 0.08)',
          display: 'flex',
        }} />

        {/* Logo mark */}
        <div style={{
          width: 96, height: 96,
          background: '#FFDF00',
          borderRadius: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          boxShadow: '0 8px 32px rgba(255, 223, 0, 0.3)',
        }}>
          <div style={{
            fontSize: 52,
            fontWeight: 900,
            color: '#002776',
            lineHeight: 1,
            display: 'flex',
          }}>
            B
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '-2px',
          lineHeight: 1,
          display: 'flex',
          marginBottom: 16,
        }}>
          BrasilBCN
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.65)',
          display: 'flex',
          marginBottom: 48,
        }}>
          La comunidad brasileña en Barcelona
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['Empleos', 'Empresas', 'Eventos', 'Guia'].map((label) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 999,
                padding: '10px 28px',
                color: 'rgba(255,255,255,0.85)',
                fontSize: 20,
                fontWeight: 600,
                display: 'flex',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
