"use client"

import { useRouter } from "next/navigation"
import LevelSelection from "../levels/level-selection"
import Navbar from ".././../components/navbar"

export default function LevelsPage() {
  const router = useRouter()

    const handleSelectLevel = (id: string) => {
    router.push(`/questions/${id}`)
  }

  return (
 
      <div className="min-h-screen bg-[#0a1230] flex flex-col"> 
      <Navbar />
      <div className="flex-grow mt-0">
        <LevelSelection onSelectLevel={handleSelectLevel} />
      </div>
    </div>
  )
}




