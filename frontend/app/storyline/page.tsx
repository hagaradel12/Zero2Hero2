"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Narrative dialogues Stepwise will speak
const dialogues = [
  "Greetings, young Codemaster! I am Stepwise, your magical guide. You have been chosen to train in the art of Decomposition.",
  "Your goal is simple, but powerful: Break down problems, plan functions and hierarchies, and design elegant solutions before coding.",
  "Along the way, you'll meet masters: Forgemaster Lin, Architect Ada, and Sage Recursa.",
  "Each level will challenge your planning, logic, and decomposition skills. Are you ready to step into the Guild and become a true Codemaster?"
];

export default function SchoolIntroWithStepwise() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState("");

  // Typewriter effect for Stepwise dialogue
  useEffect(() => {
    setTypedText("");
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(prev => prev + dialogues[step][i]);
      i++;
      if (i >= dialogues[step].length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Sparkles */}
      <motion.div
        animate={{ y: [0, -10, 0], x: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-1/3 text-pink-400 text-2xl"
      >✨</motion.div>
      <motion.div
        animate={{ y: [0, -10, 0], x: [0, -5, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-1/3 text-purple-400 text-2xl"
      >✨</motion.div>

      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold mb-12 text-center text-pink-400 drop-shadow-lg"
      >
        The Guild of Codemasters
      </motion.h1>

      {/* Stepwise Character + Speech Bubble */}
      <div className="flex flex-col items-center">
        {/* Stepwise Icon */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-pink-400 rounded-full flex items-center justify-center text-black text-3xl font-bold mb-4 drop-shadow-lg"
        >
          🤖
        </motion.div>

        {/* Speech Bubble */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-purple-800 text-purple-100 p-6 rounded-xl max-w-xl text-center shadow-lg relative before:content-[''] before:absolute before:-bottom-3 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-t-purple-800 before:border-l-transparent before:border-r-transparent"
        >
          {typedText}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-6 mt-12">
        {step < dialogues.length - 1 ? (
          <motion.button
            onClick={() => setStep(step + 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-lg transition-all"
          >
            Next
          </motion.button>
        ) : (
          <motion.button
            onClick={() => router.push("/levels")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-lg transition-all"
          >
            Begin Adventure
          </motion.button>
        )}
      </div>
    </div>
  );
}
