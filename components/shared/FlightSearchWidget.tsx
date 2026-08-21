'use client'

import { useEffect, useRef } from 'react'

const WIDGET_SRC =
  'https://tpemd.com/content?currency=eur&trs=564886&shmarker=767758&show_hotels=true&powered_by=true&locale=pt_br&searchUrl=www.aviasales.pt%2Fsearch&primary_override=%232AC72Cff&color_button=%232BC92Dbb&color_icons=%2332a8dd&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&plain=false&promo_id=7879&campaign_id=100'

export function FlightSearchWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const script = document.createElement('script')
    script.async = true
    script.src = WIDGET_SRC
    script.charset = 'utf-8'
    container.appendChild(script)

    return () => {
      container.innerHTML = ''
    }
  }, [])

  return <div ref={containerRef} className="w-full min-h-[64px]" />
}
