"use client"

import { useState, useRef } from "react"
import Editor from "@monaco-editor/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Check, MessageSquare, Code2, TerminalSquare } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CodeEditorProps {
  initialCode?: string
  onRunCode?: (code: string, language: string) => void
  onSubmitCode?: (code: string, language: string) => void
  onRequestReview?: (code: string, language: string) => void
}

export function CodeEditor({
  initialCode = "",
  onRunCode,
  onSubmitCode,
  onRequestReview,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState("javascript")
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput([])

    // 🟡 Run JavaScript locally
    if (language === "javascript") {
      setTimeout(() => {
        const logs: string[] = []
        try {
          const originalLog = console.log
          console.log = (...args) => {
            logs.push(args.map(String).join(" "))
            originalLog(...args)
          }

          // eslint-disable-next-line no-eval
          eval(code)

          console.log = originalLog
          setOutput(logs.length > 0 ? logs : ["✅ Code executed successfully!"])
        } catch (err: any) {
          setOutput([`❌ Error: ${err.message}`])
        }
        setIsRunning(false)
        onRunCode?.(code, language)
      }, 400)
    } else {
      // 🧠 For Python, Java, C++, etc. -> delegate to backend
      try {
        setOutput(["⏳ Running code on server..."])
        const res = await fetch("http://localhost:3000/code-execution", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language, code }),
        })
        const data = await res.json()
        setOutput([data.output || "✅ Executed successfully!"])
      } catch (err: any) {
        setOutput([`❌ Error: ${err.message}`])
      }
      setIsRunning(false)
    }
  }

  const handleSubmit = () => {
    onSubmitCode?.(code, language)
  }

  const handleRequestReview = () => {
    if (code.trim()) {
      onRequestReview?.(code, language)
    }
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      {/* 🧭 Top Toolbar */}
      <div className="border-b border-border p-3 flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-primary" />
          <span className="font-medium">Code Editor</span>

          {/* 🗂 Language Selector */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[130px] h-8 text-sm">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleRequestReview} disabled={!code.trim()}>
            <MessageSquare className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Review</span>
          </Button>
          <Button size="sm" variant="outline" onClick={handleRunCode} disabled={isRunning}>
            <Play className="w-4 h-4 mr-1" />
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            <Check className="w-4 h-4 mr-1" />
            Submit
          </Button>
        </div>
      </div>

      {/* 🧠 Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language}
          theme="vs-light"
          value={code}
          onChange={(val) => setCode(val ?? "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* 🖥 Console Output */}
      <div className="border-t bg-white text-black p-3 font-mono text-sm h-40 overflow-auto">
        {output.length > 0 ? (
          output.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              <TerminalSquare className="w-4 h-4 text-green-400 mt-[2px]" />
              <pre className="whitespace-pre-wrap">{log}</pre>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Console output will appear here…</p>
        )}
      </div>
    </Card>
  )
}
