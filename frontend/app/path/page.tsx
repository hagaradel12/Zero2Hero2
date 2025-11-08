"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  const openGame = () => {
    // full URL of your Phaser game's dev server
    window.location.href = "http://localhost:5173/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Magical Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.2),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.15),transparent_50%)] pointer-events-none"></div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-6 text-center drop-shadow-lg"
      >
        Welcome to <span className="text-pink-400">Zero2Hero</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-purple-200 mb-12 text-center max-w-2xl"
      >
        Level up your problem-solving skills at the{" "}
        <span className="text-purple-400 font-semibold">School of Decomposition</span> — 
        one challenge at a time.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-6"
      >
        <button
          onClick={openGame}
          className="px-10 py-5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-lg transition-all hover:scale-105"
        >
          School of Decomposition
        </button>

        <button
          onClick={() => router.push("/mainpage")}
          className="px-10 py-5 bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-pink-600 hover:to-indigo-500 text-white font-bold shadow-lg transition-all hover:scale-105"
        >
          Chat with Stepwise
        </button>
      </motion.div>

      {/* Floating animation element */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mt-16 text-pink-400 text-sm drop-shadow-lg"
      >
        🚀 Ready to start your magical journey?
      </motion.div>
    </div>
  );
}
