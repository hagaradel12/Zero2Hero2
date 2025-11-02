"use client"

import { useState } from "react"

export default function LandingPage() {
  const [currentPage, setCurrentPage] = useState<"landing" | "login" | "register">("landing")


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Zero2Hero</h1>
          <p className="text-xl text-blue-100">Master Programming Through Decomposition</p>
        </div>

        {/* Purpose Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 mb-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">What is Zero2Hero?</h2>
          <div className="space-y-4 text-blue-50">
            <p className="text-lg">
              Zero2Hero is an interactive learning platform designed to teach programming through the power of
              decomposition. We believe that breaking down complex problems into manageable pieces is the foundation of
              great programming.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/5 rounded-lg p-4 border border-blue-400/30">
                <h3 className="text-orange-400 font-bold mb-2">5 Progressive Levels</h3>
                <p className="text-sm">
                  From Micro Decomposition to System Design, master problem-solving step by step.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-blue-400/30">
                <h3 className="text-orange-400 font-bold mb-2">Interactive Graphs</h3>
                <p className="text-sm">Visualize your problem-solving process with dynamic decomposition graphs.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-blue-400/30">
                <h3 className="text-orange-400 font-bold mb-2">Gamified Learning</h3>
                <p className="text-sm">Earn XP, unlock achievements, and maintain streaks as you progress.</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-blue-400/30">
                <h3 className="text-orange-400 font-bold mb-2">Creative Rewards</h3>
                <p className="text-sm">Get bonus XP for innovative and optimized solutions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setCurrentPage("login")}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => setCurrentPage("register")}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Get Started
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-blue-200 text-sm">
          <p>Start your journey from Zero to Hero today</p>
        </div>
      </div>
    </div>
  )
}
