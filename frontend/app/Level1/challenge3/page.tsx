
"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const brokenSteps = [
  "Loop through numbers in range",
  "Get input range",
  "Initialize isPrime = True",
  "Print the number",
];

export default function RepairSpell() {
  const [availableSteps, setAvailableSteps] = useState<string[]>([]);
  const [fixedSteps, setFixedSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState("");
  const [pseudocode, setPseudocode] = useState("");

  useEffect(() => {
    const shuffled = [...brokenSteps].sort(() => Math.random() - 0.5);
    setAvailableSteps(shuffled);
  }, []);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const getList = (id: string) => {
      if (id === "available") return availableSteps;
      if (id === "fixed") return fixedSteps;
      return [];
    };

    const sourceList = Array.from(getList(source.droppableId));
    const destList = Array.from(getList(destination.droppableId));
    const [moved] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, moved);

    if (source.droppableId === "available") setAvailableSteps(sourceList);
    if (source.droppableId === "fixed") setFixedSteps(sourceList);

    if (destination.droppableId === "available") setAvailableSteps(destList);
    if (destination.droppableId === "fixed") setFixedSteps(destList);
  };

  const handleAddStep = () => {
    if (newStep.trim() === "") return;
    setFixedSteps([...fixedSteps, newStep.trim()]);
    setNewStep("");
  };

  const handleSubmit = () => {
    alert("✨ Spell repaired! You’ve rebuilt the prime-checking logic!");
    console.log("Final steps:", fixedSteps);
    console.log("Pseudocode:", pseudocode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-amber-200 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-3 text-amber-700">⭐ Repair the Spell</h1>
      <p className="text-gray-700 mb-8 text-center max-w-xl">
        The apprentice jumbled a spell that prints all prime numbers in a range.
        Reorder the steps and add any missing ones to fix the logic!
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* BROKEN STEPS */}
        <Droppable droppableId="available" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-lg mb-8 max-w-3xl justify-center"
            >
              {availableSteps.map((step, index) => (
                <Draggable key={step} draggableId={step} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-3 bg-amber-100 hover:bg-amber-200 transition rounded-xl shadow cursor-grab font-medium text-center w-[200px]"
                    >
                      {step}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* FIXED SPELL AREA */}
        <Droppable droppableId="fixed">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-white rounded-xl p-4 shadow-lg min-h-[300px] w-full max-w-2xl"
            >
              <h2 className="font-semibold text-amber-700 mb-3 text-lg">
                🔮 Correct Spell Steps (drop here)
              </h2>
              <ul className="space-y-3">
                {fixedSteps.map((s, index) => (
                  <Draggable key={s} draggableId={s} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-3 bg-amber-50 rounded-xl shadow text-gray-800 cursor-grab"
                      >
                        {index + 1}. {s}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* ADD NEW STEP */}
      <div className="mt-6 flex gap-3">
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 w-64 focus:ring-2 focus:ring-amber-400 focus:outline-none"
          placeholder="Add missing logic step..."
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
        />
        <button
          onClick={handleAddStep}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg shadow"
        >
          ➕ Add Step
        </button>
      </div>

      {/* PSEUDOCODE AREA */}
      <div className="mt-8 w-full max-w-2xl bg-white p-5 rounded-xl shadow-lg">
        <h2 className="font-semibold text-amber-700 mb-3 text-lg">
          ✍️ Write Your Fixed Pseudocode
        </h2>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-amber-400 focus:outline-none min-h-[150px]"
          placeholder="Example: for num in range(start, end): ..."
          value={pseudocode}
          onChange={(e) => setPseudocode(e.target.value)}
        />
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
      >
        ✅ Submit Repaired Spell
      </button>
    </div>
  );
}
