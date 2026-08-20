import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Shared "natural" card surface: soft ambient shadow instead of a hard
// border + abrupt hover:shadow jump, no lift-on-hover. Used across all
// listing-style cards (events, jobs, companies, listings, guides, groups)
// so hover feedback reads as one consistent, deliberate treatment.
export const CARD_SURFACE =
  "rounded-2xl bg-white ring-1 ring-black/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-10px_rgba(0,0,0,0.10)] transition-shadow duration-300 hover:shadow-[0_2px_10px_rgba(0,0,0,0.06),0_20px_36px_-16px_rgba(0,0,0,0.18)]"

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatNumber(num: number) {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}
