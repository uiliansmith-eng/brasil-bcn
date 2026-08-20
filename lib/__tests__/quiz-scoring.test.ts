import { describe, it, expect } from 'vitest'
import { computeQuizResult, scoreBreakdown } from '../quiz-scoring'

const RESULTS = {
  raiz: { order_index: 0 },
  explorador: { order_index: 1 },
  role: { order_index: 2 },
  barcelones: { order_index: 3 },
}

function selections(pattern: string[]) {
  return pattern.map((resultId, i) => ({ questionId: `q${i}`, resultId }))
}

describe('computeQuizResult', () => {
  it('returns the result with the most selections when there is a clear winner', () => {
    const winner = computeQuizResult(
      selections(['raiz', 'raiz', 'raiz', 'explorador', 'role', 'barcelones']),
      RESULTS
    )
    expect(winner).toBe('raiz')
  })

  it('breaks a 2-way tie using the lowest order_index (deterministic, admin-controlled)', () => {
    // explorador (order 1) and role (order 2) tied at 2 votes each — explorador wins
    const winner = computeQuizResult(
      selections(['explorador', 'explorador', 'role', 'role', 'barcelones']),
      RESULTS
    )
    expect(winner).toBe('explorador')
  })

  it('breaks a 3-way tie using the lowest order_index among the tied results', () => {
    // raiz, role, barcelones tied at 1 vote; explorador has 0 — raiz (order 0) wins the tie
    const winner = computeQuizResult(
      selections(['role', 'raiz', 'barcelones']),
      RESULTS
    )
    expect(winner).toBe('raiz')
  })

  it('is order-independent for the same multiset of selections', () => {
    const a = computeQuizResult(selections(['role', 'role', 'raiz']), RESULTS)
    const b = computeQuizResult(selections(['raiz', 'role', 'role']), RESULTS)
    expect(a).toBe(b)
    expect(a).toBe('role')
  })

  it('returns the only selected result when there is a single answer', () => {
    expect(computeQuizResult(selections(['barcelones']), RESULTS)).toBe('barcelones')
  })

  it('throws when no selections are provided', () => {
    expect(() => computeQuizResult([], RESULTS)).toThrow()
  })

  it('treats an unknown result id as lowest tie priority (Infinity order_index)', () => {
    // "ghost" has no entry in RESULTS -> Infinity order_index, loses tie to any known result
    const winner = computeQuizResult(
      selections(['ghost', 'raiz']),
      RESULTS
    )
    expect(winner).toBe('raiz')
  })
})

describe('scoreBreakdown', () => {
  it('counts occurrences per result id', () => {
    const counts = scoreBreakdown(selections(['raiz', 'raiz', 'role']))
    expect(counts.get('raiz')).toBe(2)
    expect(counts.get('role')).toBe(1)
    expect(counts.get('explorador')).toBeUndefined()
  })
})
