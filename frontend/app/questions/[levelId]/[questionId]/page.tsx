"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import CodeEditor from "../../code-editor"
import ProblemDescription from "../../problem-description"


interface Problem {
  _id: string
  title: string
  task: string
  initialCode: string
  expectedOutput: string
  hints: string[]
  testCases: { input: string; expected: string }[]
  xpReward?: number
  gemReward?: number
}

export default function QuestionSolvePage() {
  const { levelId, questionId } = useParams() as {
    levelId: string
    questionId: string
  }
  const router = useRouter()
  const { toast } = useToast()

  const [problem, setProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState("")
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAIVisible, setIsAIVisible] = useState(false)
  const [aiResponses, setAIResponses] = useState<
    { type: "hint" | "review"; message: string }[]
  >([])

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

  // 🧠 Centralized function to add AI responses
  const handleAIResponse = (type: "hint" | "review", content?: string) => {
    const message =
      type === "hint"
        ? content ||
          "💡 Hint: Try breaking your solution into smaller reusable functions."
        : content ||
          "🧠 Review: Great job! Try improving code readability and modularity."

    setAIResponses((prev) => [...prev, { type, message }])
    setIsAIVisible(true)
  }

  

  // 🧑‍💻 Load logged-in user
  useEffect(() => {
    const storedId = localStorage.getItem("userId")
    if (storedId) setUserId(storedId)
  }, [])

  // 📦 Fetch question
  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await fetch(`${API_BASE}/questions/${questionId}`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to load question.")
        const data = await res.json()
        setProblem(data)
        setCode(data.initialCode || "")
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (questionId) fetchQuestion()
  }, [questionId, API_BASE])


  

  if (loading)
    return <div className="p-10 text-white text-center">Loading question…</div>
  if (error) return <div className="p-10 text-red-400 text-center">{error}</div>
  if (!problem)
    return <div className="p-10 text-white text-center">Question not found.</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1f3c] via-[#081830] to-[#060f20] text-white flex flex-col">
      {/* 🧭 Header */}
      <header className="sticky top-0 z-10 bg-[#0f2547]/90 backdrop-blur-md border-b border-blue-500/20 px-6 py-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-blue-300 hover:text-blue-100"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            {problem.title}
          </h1>
          <p className="text-sm text-blue-200/70">Level {levelId}</p>
        </div>
      </header>

      {/* 💻 Main Content */}
      <main className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex flex-col lg:flex-row h-screen gap-6 p-6">
          {/* 📜 Problem Description */}
          <div className="flex-1 bg-[#0d1a33]/50 rounded-2xl p-6 overflow-auto">
            <ProblemDescription
              problem={problem}
              showHint={false}
              currentHint=""
              onShowHint={() => handleAIResponse("hint")}
              onNextHint={() => handleAIResponse("hint")}
            />
          </div>

          {/* 💻 Code Editor */}
          <div className="flex-[1.2] bg-[#0d1a33]/70 rounded-2xl p-4 overflow-hidden">
            <CodeEditor
              initialCode={code}
              userId={userId}
              questionId={questionId}
              onRunCode={(updatedCode) => setCode(updatedCode)}
              onSubmitCode={() => {
                toast({
                  title: "✅ Code submitted!",
                  description:
                    "Your solution has been submitted successfully.",
                })
              }}
              onRequestReview={(result) => {
                handleAIResponse(
                  "review",
                  `⭐ Score: ${result.score}%\n 🧾 Feedback:\n${result.feedback}`
                )
              }}
            />
          </div>
        </div>
      </main>

      {/* 💬 Floating AI Assistant */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setIsAIVisible((prev) => !prev)}
          className="rounded-full bg-blue-600 hover:bg-blue-700 p-4 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>

        {isAIVisible && (
          <div className="absolute bottom-16 right-0 w-80 bg-[#101a30] border border-blue-500/30 rounded-2xl shadow-xl p-4 space-y-2 max-h-[320px] overflow-y-auto">
            <h3 className="font-semibold text-blue-300 mb-2">AI Assistant</h3>
            {aiResponses.length === 0 ? (
              <p className="text-sm text-blue-200/60">
                No hints or reviews yet.
              </p>
            ) : (
              aiResponses.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm p-2 mb-2 rounded-lg border ${
                    msg.type === "hint"
                      ? "bg-blue-900/40 border-blue-500/30"
                      : "bg-green-900/40 border-green-500/30"
                  }`}
                >
                  {msg.message}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
