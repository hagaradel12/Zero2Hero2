"use client"

import { useEffect, useState } from "react"

interface NavbarProps {}

interface UserProgress {
  xp: number
  completedLevels: number
  totalLevels: number
  currentStreak: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export default function Navbar({}: NavbarProps) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        // 1️⃣ Get current user
        const authRes = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include",
        })
        const user = await authRes.json()

        // 2️⃣ Fetch user progress by email
        const progressRes = await fetch(`${API_BASE}/users/${user.email}`)
        const data = await progressRes.json()

        setUserProgress({
          xp: data.xp,
          completedLevels: data.completedLevels,
          totalLevels: data.totalLevels,
          currentStreak: data.streak,
        })
      } catch (err) {
        console.error("Failed to fetch user progress:", err)
      }
    }

    fetchUserProgress()
  }, [])

  if (!userProgress) return null

  const { xp, completedLevels, totalLevels, currentStreak } = userProgress
  const nextLevelXP = 1000
  const xpPercentage = ((xp % nextLevelXP) / nextLevelXP) * 100

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-950 border-b border-purple-700/40 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* 🧙‍♀️ App Logo / Title */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(232,121,249,0.4)]">
              Zero2Hero
            </h1>
          </div>

          {/* 🌟 Player Progress */}
          <div className="flex items-center gap-8 flex-1 justify-end text-purple-100">
            {/* ⚡ XP */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-purple-300 uppercase tracking-wider">Experience</p>
                <p className="text-lg font-bold text-fuchsia-300">{xp} XP</p>
              </div>
              <div className="w-32 h-2 bg-purple-800/50 rounded-full overflow-hidden border border-purple-600/40">
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 transition-all duration-300 shadow-[0_0_10px_rgba(232,121,249,0.4)]"
                  style={{ width: `${xpPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="w-px h-8 bg-purple-600/20"></div>

            {/* 🏆 Level Progress */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs text-purple-300 uppercase tracking-wider">Progress</p>
                <p className="text-lg font-bold text-purple-100">
                  {completedLevels}/{totalLevels}
                </p>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: totalLevels }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i < completedLevels
                        ? "bg-gradient-to-br from-fuchsia-400 to-purple-400 shadow-[0_0_6px_rgba(232,121,249,0.6)]"
                        : "bg-purple-800"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="w-px h-8 bg-purple-600/20"></div>

            {/* 🔥 Daily Streak */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs text-purple-300 uppercase tracking-wider">Streak</p>
                <p className="text-lg font-bold text-amber-400">{currentStreak} days</p>
              </div>
              <div className="text-2xl animate-pulse">🔥</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
