"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

interface Question {
  _id: string;
  title?: string;
  question?: string;
  xpReward?: number;
  storyIntro?: string;
}

export default function QuestionsPage() {
  const { levelId } = useParams() as { levelId: string };
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  useEffect(() => {
    if (!levelId) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_BASE}/questions/level/${levelId}`);
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        setQuestions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [levelId, API_BASE]);

  const handleQuestionClick = (q: Question) => {
    if (q.storyIntro) {
      setSelectedStory(q.storyIntro);
      setSelectedQuestionId(q._id);
    } else {
      router.push(`/questions/${levelId}/${q._id}`);
    }
  };

  const handleContinue = () => {
    if (selectedQuestionId) {
      router.push(`/questions/${levelId}/${selectedQuestionId}`);
      setSelectedStory(null);
      setSelectedQuestionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 text-white pb-16 relative overflow-hidden">
      <Navbar />

      {/* Magical glowing overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(109,40,217,0.2),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.25),transparent_40%)] pointer-events-none"></div>

      <div className="pt-32 px-10 relative z-10">
        {loading && <p className="text-center text-purple-200">Loading questions…</p>}
        {error && <p className="text-center text-rose-400">{error}</p>}
        {!loading && !error && questions.length === 0 && (
          <p className="text-center text-purple-300">No questions found.</p>
        )}

        {/* Grid Container */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl w-full">
            {questions.map((q, i) => (
              <div
                key={q._id}
                onClick={() => handleQuestionClick(q)}
                className="relative group animate-float-up cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`p-8 rounded-2xl border border-purple-700/40 bg-gradient-to-br from-purple-800/80 to-indigo-800/80 
                  hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/30">
                      {i + 1}
                    </div>
                  </div>

                  <h3 className="text-center font-bold text-lg mb-2 text-purple-100">
                    {q.title ?? q.question}
                  </h3>

                  <p className="text-center text-sm text-purple-300 mb-4">
                    Solve this magical challenge to gain XP and sharpen your spell of decomposition.
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-4 pt-4 border-t border-purple-700/30">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-300">
                      {q.xpReward ?? 0} XP
                    </span>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuestionClick(q);
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/30"
                    size="sm"
                  >
                    Begin Quest ✨
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Intro Popup */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-purple-900 to-indigo-900 border border-purple-400 rounded-2xl p-8 max-w-lg text-center shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">
              📜 Story Intro
            </h2>
            <p className="text-purple-100 whitespace-pre-line mb-6">
              {selectedStory}
            </p>

            <Button
              onClick={handleContinue}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold px-6 shadow-lg shadow-purple-500/30"
            >
              Continue to Challenge →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
