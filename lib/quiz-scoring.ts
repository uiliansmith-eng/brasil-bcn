export interface QuizAnswerSelection {
  questionId: string
  resultId: string
}

export interface ScoredResult {
  order_index: number
}

/**
 * Computes the winning result id from the user's answer selections.
 *
 * Tie-break rule (deterministic): when two or more results are tied for the
 * highest score, the result with the lowest `order_index` wins. This makes
 * ties fully controllable from the admin — reordering results changes tie
 * priority — instead of depending on answer order or Map/Object iteration
 * order, which would be non-deterministic across engines.
 */
export function computeQuizResult(
  selections: QuizAnswerSelection[],
  results: Record<string, ScoredResult>
): string {
  if (selections.length === 0) {
    throw new Error('computeQuizResult: no selections provided')
  }

  const counts = scoreBreakdown(selections)

  let winnerId: string | null = null
  let winnerScore = -1
  let winnerOrder = Infinity

  for (const [resultId, score] of counts) {
    const order = results[resultId]?.order_index ?? Infinity
    if (score > winnerScore || (score === winnerScore && order < winnerOrder)) {
      winnerId = resultId
      winnerScore = score
      winnerOrder = order
    }
  }

  return winnerId as string
}

export function scoreBreakdown(selections: QuizAnswerSelection[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const s of selections) {
    counts.set(s.resultId, (counts.get(s.resultId) ?? 0) + 1)
  }
  return counts
}
