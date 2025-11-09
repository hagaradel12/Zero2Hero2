"use client";

import { useSearchParams } from "next/navigation";
import PhaserGame from "@/components/PhaserGame";

export default function GamePage() {
  const searchParams = useSearchParams();
  const sceneName = searchParams.get("scene") || "IntroScene"; // default to intro

  return (
    <div className="w-full h-screen">
      {/* Pass the scene to PhaserGame */}
      <PhaserGame startScene={sceneName} />
    </div>
  );
}
