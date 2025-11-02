"use client"

import { Trophy, Zap, Target, Flame } from "lucide-react"

interface AchievementBadgeProps {
  type: "first_solve" | "speed_run" | "perfect_score" | "streak"
  title: string
  description: string
}

export default function AchievementBadge({ type, title, description }: AchievementBadgeProps) {
  const getIcon = () => {
    switch (type) {
      case "first_solve":
        return <Trophy className="w-6 h-6" />
      case "speed_run":
        return <Zap className="w-6 h-6" />
      case "perfect_score":
        return <Target className="w-6 h-6" />
      case "streak":
        return <Flame className="w-6 h-6" />
    }
  }

  const getColor = () => {
    switch (type) {
      case "first_solve":
        return "bg-yellow-100 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300"
      case "speed_run":
        return "bg-blue-100 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
      case "perfect_score":
        return "bg-purple-100 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
      case "streak":
        return "bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
    }
  }

  return (
    <div className={`rounded-lg border-2 p-4 ${getColor()} animate-float-up`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div>
          <p className="font-bold text-sm">{title}</p>
          <p className="text-xs opacity-80">{description}</p>
        </div>
      </div>
    </div>
  )
}
