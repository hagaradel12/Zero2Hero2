export async function callAIReview({
  userId,
  questionId,
  code,
  language = "python",
  graphNodes = [],
  hintsUsed = 0,
}: {
  userId: string
  questionId: string
  code: string
  language?: string
  graphNodes?: { id: string; label: string }[]
  hintsUsed?: number
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const res = await fetch(`${API_BASE}/api/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      questionId,
      code,
      language,
      graphNodes,
      hintsUsed,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Review failed: ${error}`)
  }

  const data = await res.json()
  return data
}
