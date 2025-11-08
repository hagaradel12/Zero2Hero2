// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// const allActions = [
//   "Flap wings",
//   "Check fuel level",
//   "Pick up package",
//   "Fly to destination",
//   "Detect and avoid tower",
//   "Refuel if low",
//   "Return to base",
//   "Drop package",
//   "Scan for obstacles",
//   "Celebrate delivery",
// ];

// export default function DroneChallenge() {
//   const [actions, setActions] = useState<string[]>([]);
//   const [simpleSteps, setSimpleSteps] = useState<string[]>([]);
//   const [functions, setFunctions] = useState<string[]>([]);
//   const [log, setLog] = useState<string>("🚀 Mission briefing ready.");
//   const [xp, setXp] = useState(0);

//   useEffect(() => {
//     setActions([...allActions].sort(() => Math.random() - 0.5));
//   }, []);

//   const handleDragEnd = (result: any) => {
//     if (!result.destination) return;
//     const { source, destination } = result;

//     if (source.droppableId === destination.droppableId && source.index === destination.index) return;

//     const newActions = [...actions];
//     const newSimpleSteps = [...simpleSteps];
//     const newFunctions = [...functions];

//     const sourceMap: any = {
//       actions: newActions,
//       simple: newSimpleSteps,
//       functions: newFunctions,
//     };
//     const destMap: any = {
//       actions: newActions,
//       simple: newSimpleSteps,
//       functions: newFunctions,
//     };

//     const sourceList = sourceMap[source.droppableId];
//     const destList = destMap[destination.droppableId];

//     const [movedItem] = sourceList.splice(source.index, 1);
//     destList.splice(destination.index, 0, movedItem);

//     setActions(newActions);
//     setSimpleSteps(newSimpleSteps);
//     setFunctions(newFunctions);

//     setLog(`🪶 Moved "${movedItem}" to ${destination.droppableId === "simple" ? "Simple Steps" : destination.droppableId === "functions" ? "Functions" : "Command Pool"}.`);
//     setXp((prev) => prev + 5);
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white font-sans">
//       {/* Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a2a] via-[#101044] to-[#1e1e60]" />
//       <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-10 animate-pulse" />

//       {/* Floating Drone */}
//       <motion.div
//         animate={{ y: [0, -20, 0], rotate: [0, 2, -2, 0] }}
//         transition={{ repeat: Infinity, duration: 3 }}
//         className="text-7xl z-10 mb-2"
//       >
//         🚁
//       </motion.div>

//       {/* Mission Title */}
//       <motion.h1
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg mb-2"
//       >
//         Sky Delivery: Mission 01
//       </motion.h1>
//       <p className="text-indigo-200 mb-8 text-center max-w-2xl">
//         Arrange your drone commands into <span className="text-yellow-400">Simple Steps</span> and{" "}
//         <span className="text-yellow-400">Functions</span> to prepare for launch!
//       </p>

//       {/* HUD */}
//       <div className="flex justify-between items-center w-full max-w-5xl mb-4 text-indigo-300 text-sm font-semibold">
//         <span>💼 Commander: You</span>
//         <span>XP: {xp}</span>
//       </div>

//       {/* Game Area */}
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div className="flex gap-6 w-full max-w-6xl justify-center items-start relative z-10">
//           {[
//             { id: "actions", title: "🎯 Command Pool" },
//             { id: "simple", title: "🧩 Simple Steps" },
//             { id: "functions", title: "⚙️ Functions" },
//           ].map((zone) => {
//             const items =
//               zone.id === "actions"
//                 ? actions
//                 : zone.id === "simple"
//                 ? simpleSteps
//                 : functions;

//             return (
//               <Droppable key={zone.id} droppableId={zone.id}>
//                 {(provided, snapshot) => (
//                   <motion.div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     className={`flex-1 min-h-[480px] rounded-3xl p-5 border-2 backdrop-blur-lg transition-all duration-300 ${
//                       snapshot.isDraggingOver
//                         ? "border-yellow-400 bg-yellow-400/20 shadow-[0_0_40px_rgba(250,204,21,0.3)]"
//                         : "border-indigo-500/30 bg-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]"
//                     }`}
//                   >
//                     <h2 className="text-xl font-bold mb-4 text-yellow-400">{zone.title}</h2>

//                     <div className="space-y-3">
//                       {items.map((item, index) => (
//                         <Draggable key={item} draggableId={item} index={index}>
//                           {(provided, snapshot) => (
//                             <motion.div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               className={`p-4 rounded-xl font-medium select-none text-center cursor-grab transition-all duration-150 ${
//                                 snapshot.isDragging
//                                   ? "bg-yellow-400 text-black shadow-[0_0_25px_rgba(250,204,21,0.8)] scale-110 rotate-2"
//                                   : "bg-indigo-600/80 hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]"
//                               }`}
//                               style={provided.draggableProps.style}
//                             >
//                               {item}
//                             </motion.div>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </div>
//                   </motion.div>
//                 )}
//               </Droppable>
//             );
//           })}
//         </div>
//       </DragDropContext>

//       {/* Log / Terminal */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mt-8 bg-black/60 border border-indigo-400/30 text-green-300 p-4 rounded-xl font-mono text-sm shadow-inner max-w-3xl w-full h-[100px] overflow-y-auto z-10"
//       >
//         <p>{log}</p>
//       </motion.div>
//     </div>
//   );
// }

// // "use client";

// // import { motion } from "framer-motion";
// // import { useRouter } from "next/navigation";

// // export default function WorkshopDoors() {
// //   const router = useRouter();

// //   const doors = [
// //     { id: 1, title: "Magic Shop System", path: "/level2/ch1", color: "#7B3FF3" },
// //     { id: 2, title: "Monster Stats Analyzer", path: "/level2/ch2", color: "#21D4FD" },
// //     { id: 3, title: "Refactor Apprentice’s Mess", path: "/level2/ch3", color: "#F9D423" },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-[#0B0C1D] to-[#20274A] flex flex-col items-center justify-center text-white p-8">
// //       <h1 className="text-4xl font-bold mb-6">🔮 The Workshop of Ideas</h1>
// //       <p className="text-center text-gray-300 max-w-xl mb-10">
// //         Master Arwen: “Choose a door, young builder. Each one hides a new challenge!”
// //       </p>

// //       <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
// //         {doors.map((door) => (
// //           <motion.div
// //             key={door.id}
// //             whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${door.color}` }}
// //             whileTap={{ scale: 0.98 }}
// //             onClick={() => router.push(door.path)}
// //             className="cursor-pointer bg-[#151A33] rounded-2xl p-6 border border-[#2B2F55] text-center hover:bg-[#1F244A] transition-all"
// //           >
// //             <div
// //               className="mx-auto mb-4 h-40 w-24 rounded-md"
// //               style={{
// //                 background: `linear-gradient(to bottom, ${door.color}44, ${door.color}11)`,
// //                 border: `2px solid ${door.color}`,
// //                 boxShadow: `0 0 15px ${door.color}55`,
// //               }}
// //             />
// //             <h2 className="text-xl font-semibold">{door.title}</h2>
// //           </motion.div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
