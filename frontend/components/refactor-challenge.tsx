"use client"

import { useState } from "react"

import CodeEditor from "../../frontend/app/questions/code-editor"

export default function RefactorChallenge({
  problem,
  userId,
  questionId,
  onReview,
  onSubmit,
}: {
  problem: any
  userId: string
  questionId: string
  onReview: (result: any) => void
  onSubmit?: () => void
}) {
  const [userCode, setUserCode] = useState("")

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* === 🧹 Apprentice’s messy code === */}
      <div className="bg-[#0c162c] border border-blue-500/20 rounded-xl p-3 overflow-hidden">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">
          Apprentice’s Messy Code 🧹
        </h3>
        <pre className="text-xs bg-[#0b1328] p-3 rounded-lg overflow-x-auto text-blue-100 whitespace-pre">
{problem.initialCode || "No initial code provided."}
        </pre>
      </div>

      {/* === ✍️ User refactor editor === */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-cyan-300 mb-2">
          Your Refactored Code ✍️
        </h3>

        <CodeEditor
          initialCode={userCode}
          userId={userId}
          questionId={questionId}
          onRunCode={(code) => setUserCode(code)}
          onSubmitCode={() => onSubmit?.()}
          onRequestReview={onReview}
        />
      </div>
    </div>
  )
}
