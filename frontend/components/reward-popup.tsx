"use client"

import { useEffect, useState } from "react"
import { Zap, Trophy, Star } from "lucide-react"

interface RewardPopupProps {
  xpGained: number
  bonusXP?: number
  isVisible: boolean
  onComplete: () => void
}

export default function RewardPopup({ xpGained, bonusXP = 0, isVisible, onComplete }: RewardPopupProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setAnimate(true)
      const timer = setTimeout(() => {
        onComplete()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div
        className={`transform transition-all duration-500 ${animate ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      >
        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 shadow-2xl border-2 border-primary/50 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
              <Star className="w-6 h-6 text-yellow-300 absolute top-0 right-0 animate-spin" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-primary-foreground mb-2">Level Complete!</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-primary-foreground">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-2xl font-bold">{xpGained} XP</span>
            </div>

            {bonusXP > 0 && (
              <div className="flex items-center justify-center gap-2 text-yellow-300 animate-pulse">
                <Star className="w-4 h-4" />
                <span className="text-lg font-semibold">+{bonusXP} Bonus XP!</span>
              </div>
            )}
          </div>

          <p className="text-primary-foreground/80 text-sm mt-4">Great job! Keep up the momentum!</p>
        </div>
      </div>
    </div>
  )
}
