"use client"

import { useState } from "react"
import {
  Lightbulb,
  BookOpen,
  PlusCircle,
  GripVertical,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Problem {
  id?: string
  _id?: string
  title: string
  task: string
  initialCode: string
  expectedOutput: string
  hints: string[]
  testCases: Array<{ input: string; expected: string }>
}

export default function ProblemDescription({
  problem,
  showHint,
  currentHint,
  onShowHint,
  onNextHint,
}: {
  problem: Problem
  showHint: boolean
  currentHint: string
  onShowHint: () => void
  onNextHint: () => void
}) {
  const [subProblems, setSubProblems] = useState<string[]>([])
  const [newSub, setNewSub] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  const handleAdd = () => {
    if (newSub.trim()) {
      setSubProblems([...subProblems, newSub.trim()])
      setNewSub("")
    }
  }

  const handleConfirm = () => {
    if (subProblems.length > 0) setConfirmed(true)
  }

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/10 transition-all duration-300">
      {/* === Header === */}
      <div className="flex items-center gap-2 mb-5 border-b border-blue-500/20 pb-3">
        <BookOpen className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-semibold tracking-wide">
          Problem Overview
        </h2>
      </div>

      {/* === Problem details (Smooth scroll) === */}
      <div className="flex-1 overflow-y-auto scroll-smooth mb-6 max-h-[400px] pr-2">
        <h3 className="text-lg font-semibold mb-2 text-blue-300">
          {problem.title}
        </h3>
        <p className="text-slate-300 mb-6 leading-relaxed whitespace-pre-line">
          {problem.task}
        </p>

        {/* === Hint Section === */}
        {showHint && (
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 mb-4 animate-fade-in">
            <p className="text-sm font-semibold text-blue-300 mb-2">💡 Hint:</p>
            <p className="text-sm text-slate-200 mb-3">{currentHint}</p>
            <Button
              onClick={onNextHint}
              size="sm"
              variant="outline"
              className="text-xs bg-blue-800/40 hover:bg-blue-700/40 border-blue-500/30 text-slate-200"
            >
              Next Hint
            </Button>
          </div>
        )}
      </div>

    </div>
  )
}
