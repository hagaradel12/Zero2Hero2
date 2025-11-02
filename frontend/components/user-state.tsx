"use client"

import { Trophy, Flame, Target } from "lucide-react"

export default function UserStats({
  xp,
  completedLevels,
  totalLevels,
}: {
  xp: number
  completedLevels: number
  totalLevels: number
}) {
  const progressPercent = (completedLevels / totalLevels) * 100
  const nextLevelXP = 1000
  const xpPercent = (xp / nextLevelXP) * 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* XP Card */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Experience</h3>
          <Flame className="w-5 h-5 text-orange-500" />
        </div>
        <p className="text-3xl font-bold text-primary mb-2">{xp}</p>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {xp} / {nextLevelXP} to next level
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Progress</h3>
          <Target className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-3xl font-bold text-primary mb-2">
          {completedLevels}/{totalLevels}
        </p>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{Math.round(progressPercent)}% complete</p>
      </div>

      {/* Streak Card */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Current Streak</h3>
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
        <p className="text-3xl font-bold text-primary mb-2">5</p>
        <div className="text-xs text-muted-foreground">days in a row</div>
        <p className="text-xs text-green-600 dark:text-green-400 mt-2">Keep it up!</p>
      </div>
    </div>
  )
}
