import { describe, it, expect } from 'vitest'
import { slugify } from '../utils'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Brasileiro Raiz')).toBe('brasileiro-raiz')
  })

  it('strips accents', () => {
    expect(slugify('Que tipo de brasileiro você é em Barcelona?')).toBe('que-tipo-de-brasileiro-voce-e-em-barcelona')
  })

  it('strips emoji and punctuation', () => {
    expect(slugify('Brasileiro do Rolê 🍻')).toBe('brasileiro-do-role')
  })

  it('collapses repeated separators and trims leading/trailing hyphens', () => {
    expect(slugify('  --Brasileiro   Barcelonês!! ❤️--  ')).toBe('brasileiro-barcelones')
  })
})
