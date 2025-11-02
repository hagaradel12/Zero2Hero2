"use client"

import { useState, useEffect } from "react"
import LevelNode from "../levels/level-node"
import RewardPopup from "@/components/reward-popup"

interface Level {
  _id: string
  name: string
  description: string
  xpReward: number
  isLocked: boolean
  order: number
  totalQuestions: number
}

export default function LevelSelection({ onSelectLevel }: { onSelectLevel: (id: string) => void }) {
  const [levels, setLevels] = useState<Level[]>([])
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [showReward, setShowReward] = useState(false)
  const [rewardXP, setRewardXP] = useState(0)
  const [userXP, setUserXP] = useState(450)
  const [userLevel, setUserLevel] = useState(2)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await fetch(`${API_BASE}/levels/levels`)
        const data = await res.json()
        const sorted = data.sort((a: Level, b: Level) => a.order - b.order)
        setLevels(sorted)
      } catch (err) {
        console.error("Error fetching levels:", err)
      }
    }
    fetchLevels()
  }, [API_BASE])

  const handleLevelComplete = (levelId: string) => {
    const level = levels.find((l) => l._id === levelId)
    if (level) {
      setRewardXP(level.xpReward)
      setShowReward(true)
      setUserXP((prev) => prev + level.xpReward)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-purple-950 relative overflow-hidden pt-24">
      {/* ✨ Decorative glowing orbs */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-20 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <h2 className="text-4xl font-extrabold text-purple-100 mb-16 text-center drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
          🧭 Your Magical Learning Journey
        </h2>

        {/* 🌌 Horizontal Scroll Container */}
        <div
          className="
            flex gap-8 overflow-x-auto scrollbar-hide 
            snap-x snap-mandatory px-4 pb-8 scroll-smooth
          "
        >
          {levels.map((level, idx) => (
            <div key={level._id} className="flex-shrink-0 w-[340px] snap-center">
              <LevelNode
                level={{
                  id: level._id,
                  name: level.name,
                  description: level.description,
                  xpReward: level.xpReward,
                  completed: false,
                  locked: level.isLocked,
                }}
                isSelected={selectedLevel === level._id}
                onSelect={() => setSelectedLevel(level._id)}
                onStart={() => onSelectLevel(level._id)}
                index={idx}
              />
            </div>
          ))}
        </div>
      </div>

      <RewardPopup xpGained={rewardXP} isVisible={showReward} onComplete={() => setShowReward(false)} />
    </div>
  )
}
