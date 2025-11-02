"use client";

import { Lock, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Level {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  completed: boolean;
  locked: boolean;
}

export default function LevelNode({
  level,
  isSelected,
  onSelect,
  onStart,
  index,
}: {
  level: Level;
  isSelected: boolean;
  onSelect: () => void;
  onStart: () => void;
  index: number;
}) {
  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onSelect}
    >
      <div
        className={`relative group cursor-pointer transition-all duration-300 ${
          level.locked ? "opacity-60" : "hover:scale-[1.03]"
        }`}
      >
        <div
          className={`relative w-full max-w-md mx-auto p-8 rounded-2xl border-2 transition-all duration-300 
            ${
              level.locked
                ? "bg-gray-100 border-gray-200"
                : isSelected
                ? "bg-gradient-to-br from-purple-100 to-indigo-100 border-fuchsia-400 shadow-[0_0_25px_rgba(192,132,252,0.3)]"
                : "bg-gradient-to-br from-white to-gray-50 border-purple-200 hover:border-fuchsia-300 hover:shadow-[0_0_15px_rgba(192,132,252,0.2)]"
            }`}
        >
          {/* Circle */}
          <div className="flex justify-center mb-5">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300
              ${
                level.completed
                  ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-400/40"
                  : isSelected
                  ? "bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-md"
                  : "bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-md"
              }`}
            >
              {index + 1}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-center font-bold text-gray-900 text-lg mb-2">
            {level.name}
          </h3>

          {/* Description */}
          <p className="text-center text-sm text-gray-600 mb-4">
            {level.description}
          </p>

          {/* Status */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {level.completed && (
              <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-semibold">
                  Completed
                </span>
              </div>
            )}
            {level.locked && (
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600 font-semibold">
                  Locked
                </span>
              </div>
            )}
          </div>

          {/* XP Reward */}
          <div className="flex items-center justify-center gap-2 mb-4 pt-4 border-t border-gray-200">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-800">
              {level.xpReward} XP
            </span>
          </div>

          {/* Start Button */}
          {!level.locked && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              className={`w-full transition-all duration-300 font-semibold ${
                level.completed
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white shadow-md"
              }`}
              size="sm"
            >
              {level.completed ? "Review" : "Start Challenge"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
// "use client";

// import { Lock, CheckCircle2, Zap } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface Level {
//   id: string;
//   name: string;
//   description: string;
//   xpReward: number;
//   completed: boolean;
//   locked: boolean;
// }

// export default function LevelNode({
//   level,
//   isSelected,
//   onSelect,
//   onStart,
//   index,
// }: {
//   level: Level;
//   isSelected: boolean;
//   onSelect: () => void;
//   onStart: () => void;
//   index: number;
// }) {
//   // Choose a color theme per level (you can adjust)
//   const levelThemes = [
//     { main: "from-amber-400 to-yellow-500", border: "border-amber-400" },
//     { main: "from-blue-500 to-cyan-500", border: "border-blue-400" },
//     { main: "from-indigo-500 to-purple-600", border: "border-indigo-400" },
//     { main: "from-emerald-500 to-green-600", border: "border-emerald-400" },
//     { main: "from-purple-500 to-fuchsia-500", border: "border-purple-400" },
//   ];

//   const theme = levelThemes[index % levelThemes.length];

//   return (
//     <div
//       className="animate-fade-in"
//       style={{ animationDelay: `${index * 0.1}s` }}
//       onClick={onSelect}
//     >
//       <div
//         className={`relative group cursor-pointer transition-all duration-300 ${
//           level.locked ? "opacity-60" : "hover:scale-[1.02]"
//         }`}
//       >
//         <div
//           className={`relative w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg border transition-all duration-300 ${
//             level.locked
//               ? "bg-gray-200 border-gray-300"
//               : `bg-gradient-to-br ${theme.main} ${theme.border}`
//           }`}
//         >
//           {/* Level number circle */}
//           <div className="flex justify-center mb-5">
//             <div
//               className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300 text-white
//                 ${
//                   level.completed
//                     ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-400/40"
//                     : isSelected
//                     ? "bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-md"
//                     : "bg-gradient-to-br from-gray-900 to-gray-700 shadow-md"
//                 }`}
//             >
//               {index + 1}
//             </div>
//           </div>

//           {/* Title */}
//           <h3 className="text-center font-bold text-white text-lg mb-2 drop-shadow">
//             {level.name}
//           </h3>

//           {/* Description */}
//           <p className="text-center text-sm text-gray-100 mb-4 opacity-90">
//             {level.description}
//           </p>

//           {/* Status */}
//           <div className="flex items-center justify-center gap-3 mb-4">
//             {level.completed && (
//               <div className="flex items-center gap-1 bg-green-100/80 px-3 py-1 rounded-full">
//                 <CheckCircle2 className="w-4 h-4 text-green-600" />
//                 <span className="text-xs text-green-700 font-semibold">
//                   Completed
//                 </span>
//               </div>
//             )}
//             {level.locked && (
//               <div className="flex items-center gap-1 bg-gray-100/80 px-3 py-1 rounded-full">
//                 <Lock className="w-4 h-4 text-gray-500" />
//                 <span className="text-xs text-gray-600 font-semibold">
//                   Locked
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* XP Reward */}
//           <div className="flex items-center justify-center gap-2 mb-4 pt-4 border-t border-white/20">
//             <Zap className="w-4 h-4 text-yellow-300" />
//             <span className="text-sm font-semibold text-white">
//               {level.xpReward} XP
//             </span>
//           </div>

//           {/* Start Button */}
//           {!level.locked && (
//             <Button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onStart();
//               }}
//               className={`w-full transition-all duration-300 font-semibold ${
//                 level.completed
//                   ? "bg-emerald-500 hover:bg-emerald-600 text-white"
//                   : "bg-black/70 hover:bg-black text-white shadow-md"
//               }`}
//               size="sm"
//             >
//               {level.completed ? "Review" : "Start Level"}
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
