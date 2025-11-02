"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Play,
  MessageSquare,
  ChevronDown,
  Loader2,
  TerminalSquare,
  Flag,
  Lightbulb,
} from "lucide-react";

interface CodeEditorProps {
  initialCode?: string;
  onRunCode?: (code: string, language: string) => void;
  onSubmitCode?: (code: string, language: string) => void;
  onFinishCode?: (code: string, language: string) => void;
  onRequestReview?: (result: {
    score: number;
    feedback: string;
    graphCompletion: number;
    passed: boolean;
  }) => void;
  userId?: string;
  questionId?: string;
  graphNodes?: any[];
  hintsUsed?: number;
}

export default function CodeEditor({
  initialCode = "",
  onRunCode,
  onSubmitCode,
  onFinishCode,
  onRequestReview,
  userId = "",
  questionId = "",
  graphNodes = [],
  hintsUsed = 0,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<"python" | "java">("python");
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isHinting, setIsHinting] = useState(false);

  const defaultSnippets: Record<string, string> = {
    python: `def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  };

  useEffect(() => {
    if (!code.trim()) setCode(defaultSnippets[language]);
  }, [language]);

  // ▶️ Run Code
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(["⏳ Running code..."]);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_EXECUTION_URL || "http://localhost:3002/code-execution",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language, code }),
        }
      );
      const data = await res.json();
      setOutput([data.output || "✅ Code executed successfully!"]);
    } catch (err: any) {
      setOutput([`❌ Error: ${err.message}`]);
    }
    setIsRunning(false);
    onRunCode?.(code, language);
  };

  // 💡 Request Hint
  const handleHint = async () => {
    if (!userId || !questionId) {
      setOutput(["⚠️ Missing user or question ID."]);
      return;
    }

    setIsHinting(true);
    setOutput(["💡 Requesting AI hint..."]);

    try {
      const res = await fetch(
        `http://localhost:3002/questions/${questionId}/hint`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId, code }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Hint request failed");

      const hintText = data.hint || data.data?.hint || "No hint provided yet.";

      setOutput([`💡 Hint: ${hintText}`]);
    } catch (err: any) {
      setOutput([`❌ Hint Error: ${err.message}`]);
    }

    setIsHinting(false);
  };

  // 🏁 Finish Question (final submit)
  const handleFinish = async () => {
    if (!code.trim()) return;
    setIsFinishing(true);
    setOutput(["🏁 Finalizing your submission..."]);

    try {
      const res = await fetch(`http://localhost:3002/questions/${questionId}/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, score: 100 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Finish failed");

      setOutput([
        "🎉 Question marked as finished!",
        data.message || "Submission finalized successfully.",
      ]);

      onFinishCode?.(code, language);
    } catch (err: any) {
      setOutput([`❌ Finish Error: ${err.message}`]);
    }

    setIsFinishing(false);
  };

  // 🤖 Request AI Review
  const handleRequestReview = async () => {
    if (!code.trim()) return;
    setIsReviewing(true);
    setOutput(["🧠 Requesting AI review..."]);

    try {
      const res = await fetch(`http://localhost:3002/questions/${questionId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, questionId, code, language, graphNodes, hintsUsed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "AI review failed");

      const result = {
        score: data.score ?? 0,
        feedback: data.feedback ?? "No feedback provided",
        graphCompletion: data.graphCompletion ?? 0,
        passed: data.passed ?? false,
      };

      setOutput(["✅ Review completed! Check AI Assistant for details."]);
      onRequestReview?.(result);
    } catch (err: any) {
      setOutput([`❌ Review Error: ${err.message}`]);
    }

    setIsReviewing(false);
  };

  const getLanguageLabel = (lang: string) => (lang === "python" ? "Python" : "Java");

  return (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-md border border-blue-500/20 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/10 transition-all duration-300">
      {/* === 🧭 Top Bar === */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-blue-500/20 bg-slate-800/70 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-blue-300">Code Editor</span>

          {/* Language Selector */}
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-xs bg-slate-800/40 hover:bg-blue-800/30 border-blue-500/30 text-slate-200"
            >
              {getLanguageLabel(language)}
              <ChevronDown className="w-3 h-3" />
            </Button>

            <div className="absolute mt-1 right-0 w-32 bg-slate-900 border border-blue-500/30 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {["python", "java"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as "python" | "java")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-800/30 transition-all ${
                    language === lang
                      ? "bg-blue-700/40 text-blue-300 font-semibold"
                      : "text-slate-200"
                  }`}
                >
                  {getLanguageLabel(lang)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* === 🧠 Action Buttons === */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleHint}
            disabled={isHinting}
            className="bg-yellow-600/40 hover:bg-yellow-500/40 border-yellow-500/30 text-yellow-100"
          >
            {isHinting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Hinting...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-1" /> Hint
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleRequestReview}
            disabled={isReviewing}
            className="bg-blue-800/40 hover:bg-blue-700/40 border-blue-500/30 text-slate-200"
          >
            {isReviewing ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Reviewing...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-1" /> Review
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleRunCode}
            disabled={isRunning}
            className="bg-blue-800/40 hover:bg-blue-700/40 border-blue-500/30 text-slate-200"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" /> Run
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={handleFinish}
            disabled={isFinishing}
            className="bg-green-700 hover:bg-green-600 text-white"
          >
            {isFinishing ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Finishing...
              </>
            ) : (
              <>
                <Flag className="w-4 h-4 mr-1" /> Finish
              </>
            )}
          </Button>
        </div>
      </div>

      {/* === 💻 Code Editor === */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val ?? "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: "Fira Code, Courier New, monospace",
            lineNumbers: "on",
          }}
        />
      </div>

      {/* === 🖥 Console Output === */}
      <div className="border-t border-blue-500/20 bg-slate-950/80 text-green-400 p-4 font-mono text-sm h-44 overflow-auto rounded-b-2xl shadow-inner shadow-blue-500/10">
        {output.length > 0 ? (
          output.map((log, i) => (
            <div key={i} className="flex items-start gap-2 animate-fade-in">
              <TerminalSquare className="w-4 h-4 text-green-400 mt-[2px]" />
              <pre className="whitespace-pre-wrap">{log}</pre>
            </div>
          ))
        ) : (
          <p className="text-slate-500">Console output will appear here…</p>
        )}
      </div>
    </div>
  );
}
