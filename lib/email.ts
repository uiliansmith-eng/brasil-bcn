const SITE_URL = 'https://www.brasilbcn.com'

export function wrapEmail(title: string, bodyHtml: string, ctaUrl?: string, ctaLabel?: string, footer?: string) {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1f2937;">` +
    `<div style="text-align:center;margin-bottom:28px;"><span style="font-size:20px;font-weight:800;color:#009C3B;">Brasil<span style="color:#111827;">BCN</span></span></div>` +
    `<h2 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 12px;">${title}</h2>` +
    `<p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 20px;">${bodyHtml}</p>` +
    (ctaUrl && ctaLabel
      ? `<p style="text-align:center;margin:0 0 24px;"><a href="${ctaUrl}" style="display:inline-block;background:#009C3B;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:10px;">${ctaLabel}</a></p>`
      : '') +
    (footer ? `<p style="font-size:12px;line-height:1.6;color:#9ca3af;margin:0;">${footer}</p>` : '') +
    `</div>`
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY || !to) return
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Brasil BCN <noreply@brasilbcn.com>',
        to,
        subject,
        html,
      }),
    })
    if (!res.ok) {
      console.error('sendEmail failed:', res.status, await res.text())
    }
  } catch (err) {
    console.error('sendEmail failed:', err)
  }
}
