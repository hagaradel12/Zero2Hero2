"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import door from '../src/assets/tileset_dungeon_PNG.png'

interface DoorProps {
  status: "locked" | "unlocked" | "completed";
  onClick?: () => void;
}

export default function Door({ status, onClick }: DoorProps) {
  const glowColor =
    status === "completed"
      ? "from-yellow-400/30 to-orange-500/20"
      : status === "unlocked"
      ? "from-cyan-400/30 to-blue-600/20"
      : "from-slate-700/10 to-slate-900/5";

  const shadow =
    status === "locked"
      ? "shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      : "shadow-[0_0_25px_rgba(0,180,255,0.3)]";

  return (
    <motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  onClick={onClick}
  className="relative w-[160px] h-[200px] sm:w-[200px] sm:h-[260px] cursor-pointer"
>
  <motion.div
    className={`absolute inset-0 rounded-2xl border-4 shadow-lg ${
      status === "locked"
        ? "border-gray-500 shadow-gray-700"
        : "border-purple-500 shadow-purple-700"
    }`}
    animate={{
      boxShadow:
        status === "locked"
          ? "0px 0px 10px rgba(100,100,100,0.3)"
          : "0px 0px 30px rgba(123,63,243,0.6)",
    }}
    transition={{ duration: 0.5 }}
  />
  <Image
    src={door}
    alt="Door"
    width={200}
    height={260}
    className="object-contain z-10"
  />
</motion.div>

  );
}
