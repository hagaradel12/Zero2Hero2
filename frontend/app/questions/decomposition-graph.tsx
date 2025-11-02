"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Zap, Gem } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DecompositionNode {
  id: string
  label: string
  status: "incomplete" | "completed" | "locked"
  dependencies: string[]
  isCustom: boolean
  xpReward?: number
  gemReward?: number
}

interface DecompositionGraphProps {
  problemId: string
  onNodeComplete: (nodeId: string, xpGained: number, gemsGained: number) => void
}

export default function DecompositionGraph({ problemId, onNodeComplete }: DecompositionGraphProps) {
  const [nodes, setNodes] = useState<DecompositionNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newNodeLabel, setNewNodeLabel] = useState("")
  const [showAddNode, setShowAddNode] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await fetch(`${API_BASE}/questions/${problemId}`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch question graph")
        const data = await res.json()

        const formattedNodes: DecompositionNode[] = (data.graphNodes || []).map((n: any, index: number) => ({
          id: n.id ?? String(index + 1),
          label: n.label ?? `Step ${index + 1}`,
          status: n.filled ? "completed" : index === 0 ? "incomplete" : "locked",
          dependencies: n.dependencies ?? (index > 0 ? [String(index)] : []),
          isCustom: !!n.isCustom,
          xpReward: n.xpReward,
          gemReward: n.gemReward,
        }))
        setNodes(formattedNodes)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (problemId) fetchGraph()
  }, [problemId, API_BASE])

  const handleCompleteNode = (nodeId: string) => {
    setNodes((prev) => {
      const idx = prev.findIndex((n) => n.id === nodeId)
      if (idx === -1) return prev
      const target = prev[idx]
      if (target.status !== "incomplete") return prev

      const updated = prev.map((n) =>
        n.id === nodeId ? { ...n, status: "completed" } : n
      )

      const unlocked = updated.map((n) =>
        n.dependencies.includes(nodeId) && n.status === "locked"
          ? { ...n, status: "incomplete" }
          : n
      )

      const xpReward = target.xpReward ?? (target.isCustom ? 150 : 100)
      const gemReward = target.gemReward ?? (target.isCustom ? 2 : 0)
      onNodeComplete(nodeId, xpReward, gemReward)

      return unlocked
    })
  }

  const handleAddNode = () => {
    if (!newNodeLabel.trim()) return
    const newNode: DecompositionNode = {
      id: `custom-${Date.now()}`,
      label: newNodeLabel,
      status: "incomplete",
      dependencies: [],
      isCustom: true,
      xpReward: 150,
      gemReward: 2,
    }
    setNodes((prev) => [...prev, newNode])
    setNewNodeLabel("")
    setShowAddNode(false)
  }

  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId))
  }

  const getNodeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 border-green-600"
      case "incomplete":
        return "bg-blue-500 border-blue-600 hover:bg-blue-600 cursor-pointer"
      case "locked":
        return "bg-slate-500 border-slate-600 opacity-50"
      default:
        return "bg-slate-400 border-slate-500"
    }
  }

  if (loading) return <p className="text-white">Loading decomposition graph…</p>
  if (error) return <p className="text-red-400">{error}</p>

  return (
    <div className="bg-white/5 rounded-lg border border-slate-700 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Decomposition Graph</h2>
        <Button size="sm" variant="outline" onClick={() => setShowAddNode(!showAddNode)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Step
        </Button>
      </div>

      {/* Add Node */}
      {showAddNode && (
        <div className="mb-6 p-4 bg-blue-950/30 rounded-lg border border-blue-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={newNodeLabel}
              onChange={(e) => setNewNodeLabel(e.target.value)}
              placeholder="Enter custom step..."
              className="flex-1 px-3 py-2 rounded border border-slate-600 bg-transparent text-white text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAddNode()}
            />
            <Button size="sm" onClick={handleAddNode} className="bg-blue-500 hover:bg-blue-600">
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Graph — Horizontal flow */}
      <div className="flex items-center justify-start overflow-x-auto space-x-6 pb-6 scrollbar-thin scrollbar-thumb-slate-700">
        {nodes.map((node, index) => (
          <div key={node.id} className="flex items-center gap-6">
            {/* Node Circle */}
            <div
              onClick={() => node.status === "incomplete" && handleCompleteNode(node.id)}
              className={`relative flex flex-col items-center text-center transition-all ${
                node.status === "incomplete" ? "hover:scale-105" : ""
              }`}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center border-4 text-sm font-semibold text-white ${getNodeColor(
                  node.status
                )}`}
              >
                {node.label.length > 10 ? node.label.slice(0, 10) + "…" : node.label}
              </div>

              {/* Rewards */}
              {node.isCustom && (
                <div className="flex gap-2 mt-2 text-xs text-white/80">
                  <div className="flex items-center gap-1 text-yellow-300">
                    <Zap className="w-3 h-3" />+{node.xpReward}
                  </div>
                  <div className="flex items-center gap-1 text-purple-300">
                    <Gem className="w-3 h-3" />+{node.gemReward}
                  </div>
                </div>
              )}

              {/* Delete */}
              {node.isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteNode(node.id)
                  }}
                  className="absolute -top-2 -right-2 bg-slate-800 text-white/70 hover:text-white rounded-full p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Connector line */}
            {index < nodes.length - 1 && (
              <div className="flex-1 h-0.5 bg-gradient-to-r from-slate-500 to-slate-400 w-12"></div>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm text-white/80">
          <span>Progress</span>
          <span className="font-semibold text-white">
            {nodes.filter((n) => n.status === "completed").length} / {nodes.length}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(nodes.filter((n) => n.status === "completed").length / nodes.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
