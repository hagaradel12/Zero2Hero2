"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Code2, Coins, Flame, Menu, Home, History, Settings, Sword, Trophy } from "lucide-react"
import Link from "next/link"
import { ChatInterface } from "./chat-bot"
import { CodeEditor } from "./editor"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [codeToReview, setCodeToReview] = useState<string>("")
  const [progressPercent, setProgressPercent] = useState(0)
  const [currentPlan, setCurrentPlan] = useState<any[]>([])
  const [currentThreadId, setCurrentThreadId] = useState<string>("")
  const [currentQuestion, setCurrentQuestion] = useState<string>("")
  const [completedCount, setCompletedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const [userStats] = useState({
    coins: 150,
    streak: 5,
  })

  // ✅ Called when user generates a plan
  const handlePlanGenerated = (plan: any[], threadId: string, question: string) => {
    setCurrentPlan(plan)
    setCurrentThreadId(threadId)
    setCurrentQuestion(question)
    setTotalCount(plan.length)
    setCompletedCount(0)
    setProgressPercent(0)
    console.log("📋 Plan received:", { plan, threadId, question })
  }

  // ✅ Update progress based on AI feedback
  const handleProgressUpdate = (completed: number, total: number, percent: number) => {
    setCompletedCount(completed)
    setTotalCount(total)
    setProgressPercent(percent)
    
    console.log(`📊 Progress: ${completed}/${total} functions (${percent}%)`)
    
    // Could add rewards/celebrations here
    if (percent === 100) {
      console.log("🎉 All functions completed!")
      // Could trigger confetti, award coins, etc.
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-surface px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold hidden sm:inline">Zero2Hero</span>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-secondary" />
                <span className="font-bold">{userStats.coins}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold">{userStats.streak} day streak</span>
              </div>
            </div>

            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="border-b border-border bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {progressPercent === 100 ? (
              <Trophy className="text-yellow-500 w-6 h-6 animate-pulse" />
            ) : (
              <Sword className="text-primary w-5 h-5" />
            )}
            <div>
              <h2 className="font-semibold text-sm sm:text-base">
                {currentQuestion 
                  ? `${currentQuestion.slice(0, 60)}${currentQuestion.length > 60 ? '...' : ''}` 
                  : "Select a problem to start"}
              </h2>
              {totalCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {completedCount} of {totalCount} functions completed
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-1/3">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                className={`h-3 ${
                  progressPercent === 100 
                    ? 'bg-gradient-to-r from-green-400 to-green-600' 
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className={`text-sm font-bold whitespace-nowrap ${
              progressPercent === 100 ? 'text-green-600' : 'text-gray-700'
            }`}>
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-16 border-r border-border bg-surface flex-col">
          <nav className="flex-1 p-2 space-y-2">
            <Button variant="ghost" size="icon" className="w-full" asChild title="Dashboard">
              <Link href="/mainpage">
                <Home className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="w-full" asChild title="Problem History">
              <Link href="/dashboard">
                <History className="w-5 h-5" />
              </Link>
            </Button>
          </nav>
        </aside>

        {/* Chat + Editor */}
        <main className="flex-1 flex flex-col bg-background overflow-hidden">
          <section className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* Chat Interface */}
            <div className="flex flex-col lg:w-1/2 border-r border-border overflow-hidden">
              <ChatInterface 
                externalMessage={codeToReview}
                onPlanGenerated={handlePlanGenerated}
                onProgressUpdate={handleProgressUpdate}
              />
            </div>

            {/* Code Editor */}
            <div className="flex flex-col lg:w-1/2 overflow-hidden">
              <div className="border-b border-border p-3 flex items-center justify-between bg-surface">
                <h2 className="font-semibold">Code Workspace</h2>
                {currentPlan.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      {currentPlan.length} functions to implement
                    </div>
                    {progressPercent === 100 && (
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-auto">
                <CodeEditor
                  onRunCode={(code) => console.log("Running code:", code)}
                  onSubmitCode={(code) => {
                    console.log("Submitting code:", code)
                  }}
                  onRequestReview={(code) => {
                    setCodeToReview(code)
                    console.log("Review requested for:", code)
                  }}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}