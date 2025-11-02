"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Send, Bot, RefreshCw, CheckCircle2, Circle, Loader } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  type?: "hint" | "question" | "feedback" | "code-review" | "plan" | "completion"
}

export type FunctionStatus = {
  function: string
  status: "not_started" | "in_progress" | "completed"
  score: number
}

interface ChatInterfaceProps {
  externalMessage?: string
  onPlanGenerated?: (plan: any[], threadId: string, question: string) => void
  onProgressUpdate?: (completed: number, total: number, percent: number) => void
}

export function ChatInterface({ externalMessage, onPlanGenerated, onProgressUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm your AI programming tutor. Describe a coding problem and I'll help you solve it step by step!",
      timestamp: new Date(),
      type: "question",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPlanned, setIsPlanned] = useState(false)
  const [plan, setPlan] = useState<any[]>([])
  const [currentFunction, setCurrentFunction] = useState<string>("")
  const [currentThreadId, setCurrentThreadId] = useState<string>("")
  const [originalQuestion, setOriginalQuestion] = useState<string>("")
  const [completedFunctions, setCompletedFunctions] = useState<FunctionStatus[]>([])
  const [allCompleted, setAllCompleted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastExternalMessage = useRef("")

  const BACKEND_URL = "http://localhost:8000"

  // ✅ Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ✅ Handle external message (code review)
  useEffect(() => {
    if (externalMessage && externalMessage.trim() && externalMessage !== lastExternalMessage.current) {
      lastExternalMessage.current = externalMessage
      if (isPlanned) {
        handleCodeReview(externalMessage)
      }
    }
  }, [externalMessage, isPlanned])

  const resetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "👋 Ready for a new challenge! Describe your programming problem.",
        timestamp: new Date(),
        type: "question",
      },
    ])
    setInput("")
    setPlan([])
    setIsPlanned(false)
    setCurrentFunction("")
    setCurrentThreadId("")
    setOriginalQuestion("")
    setCompletedFunctions([])
    setAllCompleted(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userInput = input.trim()
    setInput("")
    
    if (!isPlanned) {
      await handlePlanRequest(userInput)
    } else {
      await handleChatMessage(userInput)
    }
  }

  // 🧩 Step 1: Generate Plan
  const handlePlanRequest = async (problemDescription: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: problemDescription,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: problemDescription }),
      })

      if (!response.ok) throw new Error(`Error ${response.status}`)
      
      const data = await response.json()
      const planList = data.data.plan || []
      const threadId = data.data.thread_id
      const startingMsg = data.data.starting_message || "Here's your step-by-step plan!"

      setPlan(planList)
      setIsPlanned(true)
      setCurrentFunction(planList[0]?.function || "")
      setCurrentThreadId(threadId)
      setOriginalQuestion(problemDescription)

      // Initialize function statuses
      const initialStatuses: FunctionStatus[] = planList.map((p: any) => ({
        function: p.function,
        status: "not_started" as const,
        score: 0,
      }))
      setCompletedFunctions(initialStatuses)

      // Notify parent about plan generation
      onPlanGenerated?.(planList, threadId, problemDescription)
      onProgressUpdate?.(0, planList.length, 0)

      const planMessage = `📘 **${startingMsg}**\n\n${planList
        .map((p: any, i: number) => `**${i + 1}. ${p.function}**\n   ${p.purpose}\n   📥 Input: ${p.input}\n   📤 Output: ${p.output}`)
        .join("\n\n")}\n\n✨ Let's start with **${planList[0]?.function}**! What would you like to know or try first?`

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: planMessage,
          timestamp: new Date(),
          type: "plan",
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `⚠️ Error generating plan: ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: new Date(),
          type: "feedback",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // 💬 Step 2: Ongoing Chat
  const handleChatMessage = async (userInput: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          plan,
          currentFunction,
          thread_id: currentThreadId,
          completedFunctions,
        }),
      })

      if (!response.ok) throw new Error(`Error ${response.status}`)
      
      const data = await response.json()
      handleBotResponse(data.data)
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `⚠️ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: new Date(),
          type: "feedback",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // 🔍 Code Review Handler
  const handleCodeReview = async (code: string) => {
    if (!currentThreadId) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "⚠️ Please start a session first by describing a problem.",
          timestamp: new Date(),
          type: "feedback",
        },
      ])
      return
    }

    const codeMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Please review my code for ${currentFunction}:\n\`\`\`\n${code}\n\`\`\``,
      timestamp: new Date(),
      type: "code-review",
    }

    setMessages((prev) => [...prev, codeMessage])
    setIsLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, codeMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          plan,
          currentFunction,
          thread_id: currentThreadId,
          completedFunctions,
        }),
      })

      if (!response.ok) throw new Error(`Error ${response.status}`)
      
      const data = await response.json()
      handleBotResponse(data.data)
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `⚠️ Error reviewing code: ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: new Date(),
          type: "feedback",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // 🧠 Handle Bot Response with Progress Tracking
  const handleBotResponse = (chatData: any) => {
    let content = chatData.message || "I'm here to help!"
    
    // Update ALL function statuses if provided (supports analyzing multiple functions at once)
    if (chatData.functions_analyzed && chatData.functions_analyzed.length > 0) {
      const analyzedFuncs = chatData.functions_analyzed
      
      setCompletedFunctions(prev => {
        const updated = prev.map(f => {
          // Find if this function was analyzed in the response
          const analyzed = analyzedFuncs.find((af: any) => af.function === f.function)
          if (analyzed && analyzed.found) {
            return {
              ...f,
              status: analyzed.status,
              score: analyzed.score
            }
          }
          return f
        })
        
        // Find next incomplete function to focus on
        const nextIncomplete = updated.find(f => f.status !== "completed")
        if (nextIncomplete) {
          setCurrentFunction(nextIncomplete.function)
        } else {
          // All completed!
          const lastFunc = plan[plan.length - 1]
          if (lastFunc) setCurrentFunction(lastFunc.function)
        }
        
        return updated
      })
    }
    // Fallback: single function status (backward compatibility)
    else if (chatData.function_status) {
      const funcStatus = chatData.function_status
      setCompletedFunctions(prev => {
        const updated = prev.map(f => 
          f.function === funcStatus.function 
            ? { ...f, status: funcStatus.status, score: funcStatus.score }
            : f
        )
        
        // Update current function if completed
        if (funcStatus.status === "completed") {
          const currentIndex = plan.findIndex(p => p.function === funcStatus.function)
          if (currentIndex >= 0 && currentIndex < plan.length - 1) {
            setCurrentFunction(plan[currentIndex + 1].function)
          }
        }
        
        return updated
      })
    }

    // Add hints if provided
    if (chatData.hints && chatData.hints.length > 0) {
      content += `\n\n💡 **Hints:**\n${chatData.hints.map((h: string) => `• ${h}`).join("\n")}`
    }
    
    // Show which functions were found and analyzed
    if (chatData.functions_analyzed && chatData.functions_analyzed.length > 0) {
      const completed = chatData.functions_analyzed.filter((f: any) => f.found && f.status === "completed")
      const inProgress = chatData.functions_analyzed.filter((f: any) => f.found && f.status === "in_progress")
      
      if (completed.length > 0 || inProgress.length > 0) {
        content += "\n\n📊 **Function Status:**\n"
        
        completed.forEach((f: any) => {
          content += `✅ **${f.function}** - Completed! (${f.score}/100)\n`
        })
        
        inProgress.forEach((f: any) => {
          content += `🔄 **${f.function}** - In progress (${f.score}/100)\n`
        })
      }
    }
    
    // Add next step
    if (chatData.next_step) {
      content += `\n\n🎯 **Next Step:** ${chatData.next_step}`
    }

    // Check if all completed
    if (chatData.all_completed) {
      setAllCompleted(true)
      if (chatData.completion_message) {
        content = `🎉🎉🎉\n\n${chatData.completion_message}\n\n${content}`
      }
    }

    // Update progress
    if (chatData.progress_percent !== undefined) {
      onProgressUpdate?.(chatData.completed_count || 0, chatData.total_count || plan.length, chatData.progress_percent)
    }

    const messageType = chatData.all_completed ? "completion" : "feedback"

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content,
        timestamp: new Date(),
        type: messageType,
      },
    ])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Expose function to window for external calls
  useEffect(() => {
    // @ts-ignore
    window.submitCodeToChat = handleCodeReview
  }, [currentThreadId, plan, currentFunction, messages, completedFunctions])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-3 bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-primary">AI Tutor 🧠</h2>
            {isPlanned && (
              <p className="text-xs text-muted-foreground">
                Working on: <span className="font-medium text-blue-600">{currentFunction}</span>
              </p>
            )}
          </div>
          <Button onClick={resetChat} variant="outline" size="sm" className="space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>New Problem</span>
          </Button>
        </div>

        {/* Progress Indicators */}
        {isPlanned && completedFunctions.length > 0 && (
          <div className="mt-3 space-y-1">
            {completedFunctions.map((func, index) => (
              <div key={func.function} className="flex items-center gap-2 text-sm">
                {func.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : func.status === "in_progress" ? (
                  <Loader className="w-4 h-4 text-yellow-500 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300" />
                )}
                <span className={cn(
                  "flex-1",
                  func.status === "completed" && "text-green-600 font-medium",
                  func.status === "in_progress" && "text-yellow-600",
                  func.status === "not_started" && "text-gray-400"
                )}>
                  {func.function}
                </span>
                {func.score > 0 && (
                  <span className="text-xs text-gray-500">{func.score}/100</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-3">
            <Card className="flex-1 p-4 bg-surface">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-surface p-4">
        {allCompleted ? (
          <div className="text-center py-4">
            <p className="text-lg font-bold text-green-600 mb-2">🎉 All functions completed! 🎉</p>
            <Button onClick={resetChat} className="mt-2">
              Start New Problem
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isPlanned
                  ? "Ask questions, share your code, or discuss your approach..."
                  : "Describe your programming problem (e.g., 'Create a function to find prime numbers')..."
              }
              className="min-h-[60px] max-h-[200px] resize-none"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" className="h-[60px] w-[60px]" disabled={isLoading || !input.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"
  const isCompletion = message.type === "completion"

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-surface-secondary px-4 py-2 rounded-full text-sm text-muted">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <Card
        className={cn(
          "flex-1 p-4 max-w-[85%]",
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : isCompletion
            ? "bg-green-500 text-white rounded-bl-none"
            : "bg-purple-500 text-white rounded-bl-none"
        )}
      >
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-white">
          {message.content}
        </div>
        <div className="text-xs text-white/80 mt-2 text-right">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </Card>
    </div>
  )
}