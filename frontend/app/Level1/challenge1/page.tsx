"use client";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const allSteps = [
  { id: "1", label: "Check if ingredients available", icon: "📜" },
  { id: "2", label: "Measure ingredients", icon: "⚖️" },
  { id: "3", label: "Mix potion", icon: "🧪" },
  { id: "4", label: "Heat until temperature reached", icon: "🔥" },
  { id: "5", label: "If overheated → cool down", icon: "❄️" },
  { id: "6", label: "Pour into bottle", icon: "🍶" },
  { id: "7", label: "Serve potion", icon: "🧙" },
];

export default function PotionMachine() {
  const [available, setAvailable] = useState(allSteps);
  const [selected, setSelected] = useState<any[]>([]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destId = result.destination.droppableId;

    if (sourceId === destId) {
      // Reordering within same list
      const list = Array.from(sourceId === "available" ? available : selected);
      const [moved] = list.splice(result.source.index, 1);
      list.splice(result.destination.index, 0, moved);
      sourceId === "available" ? setAvailable(list) : setSelected(list);
    } else {
      // Moving between lists
      const sourceList = Array.from(sourceId === "available" ? available : selected);
      const destList = Array.from(destId === "available" ? available : selected);
      const [moved] = sourceList.splice(result.source.index, 1);
      destList.splice(result.destination.index, 0, moved);
      sourceId === "available"
        ? (setAvailable(sourceList), setSelected(destList))
        : (setSelected(sourceList), setAvailable(destList));
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#d1c4f2] via-[#b39ddb] to-[#5e35b1] text-gray-900 flex flex-col items-center py-10">
  <h1 className="text-5xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-500">
    ⚗️ Potion Maker
  </h1>

  <DragDropContext onDragEnd={handleDragEnd}>
    {/* AVAILABLE STEPS */}
    <section className="w-full max-w-6xl mb-12">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
        🧩 Available Steps
      </h2>
      <Droppable droppableId="available" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-6 overflow-x-auto items-center px-6 py-8 rounded-3xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-inner shadow-purple-300/30"
          >
            {available.map((step, index) => (
              <Draggable key={step.id} draggableId={step.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`min-w-[160px] h-[160px] flex flex-col items-center justify-center rounded-2xl text-center font-medium cursor-grab transition-all duration-300 ${
                      snapshot.isDragging
                        ? "scale-105 bg-gradient-to-br from-indigo-400 to-purple-400 shadow-lg shadow-indigo-500/40"
                        : "bg-white/60 hover:bg-white/80 border border-gray-200 shadow-md"
                    }`}
                  >
                    <div className="text-4xl mb-2">{step.icon}</div>
                    <p className="text-sm text-gray-800 px-3">{step.label}</p>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>

    {/* SELECTED STEPS */}
    <section className="w-full max-w-6xl">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
        🧙 Potion Plan
      </h2>
      <Droppable droppableId="selected" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-6 overflow-x-auto items-center px-6 py-8 rounded-3xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-inner shadow-indigo-300/30"
          >
            {selected.map((step, index) => (
              <Draggable key={step.id} draggableId={`s-${step.id}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`min-w-[160px] h-[160px] flex flex-col items-center justify-center rounded-2xl text-center font-medium cursor-grab transition-all duration-300 ${
                      snapshot.isDragging
                        ? "scale-105 bg-gradient-to-br from-pink-400 to-purple-400 shadow-lg shadow-pink-500/40"
                        : "bg-white/60 hover:bg-white/80 border border-gray-200 shadow-md"
                    }`}
                  >
                    <div className="text-4xl mb-2">{step.icon}</div>
                    <p className="text-sm text-gray-800 px-3">{step.label}</p>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  </DragDropContext>
</div>

  );
}
