"use client"

import { useEffect, useState } from "react"

interface ProgressTrackerProps {
  currentXP: number
  nextLevelXP: number
  level: number
}

export default function ProgressTracker({ currentXP, nextLevelXP, level }: ProgressTrackerProps) {
  const [displayXP, setDisplayXP] = useState(currentXP)
  const progressPercent = (displayXP / nextLevelXP) * 100

  useEffect(() => {
    if (displayXP !== currentXP) {
      const interval = setInterval(() => {
        setDisplayXP((prev) => {
          const diff = currentXP - prev
          if (diff > 0) {
            return Math.min(prev + Math.ceil(diff / 10), currentXP)
          }
          return currentXP
        })
      }, 30)
      return () => clearInterval(interval)
    }
  }, [currentXP, displayXP])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Level {level}</span>
        <span className="text-sm text-muted-foreground">
          {displayXP} / {nextLevelXP}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        ></div>
      </div>
    </div>
  )
}
