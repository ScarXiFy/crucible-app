"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizWithQuestions } from "@/lib/types";

export function QuizRunner({ quiz }: { quiz: QuizWithQuestions }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentQuestion = quiz.questions[currentIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  async function submit() {
    setMessage(null);
    setIsSubmitting(true);

    const response = await fetch(`/api/quizzes/${quiz.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    const payload = (await response.json()) as { attemptId?: string; error?: string };

    if (!response.ok || !payload.attemptId) {
      setMessage(payload.error || "Could not submit this attempt.");
      setIsSubmitting(false);
      return;
    }

    router.push(`/results/${payload.attemptId}`);
    router.refresh();
  }

  if (!currentQuestion) {
    return (
      <div className="border border-stone-300 bg-white p-8">
        This quiz does not have questions yet.
      </div>
    );
  }

  return (
    <div className="border border-stone-300 bg-white p-6 shadow-[6px_6px_0_#1c1917]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">
            Question {currentIndex + 1} of {quiz.questions.length}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-stone-950">{quiz.title}</h1>
        </div>
        <p className="text-sm font-medium text-stone-500">
          {answeredCount}/{quiz.questions.length} answered
        </p>
      </div>

      <div className="py-8">
        <h2 className="text-3xl font-semibold leading-tight text-stone-950">
          {currentQuestion.prompt}
        </h2>
        <div className="mt-8 space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  setAnswers((current) => ({
                    ...current,
                    [currentQuestion.id]: option.id,
                  }))
                }
                className={`w-full border px-4 py-4 text-left transition ${
                  isSelected
                    ? "border-stone-950 bg-stone-950 text-white"
                    : "border-stone-300 bg-[#fbfaf5] text-stone-800 hover:border-stone-950"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {message ? (
        <p className="mb-4 border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {message}
        </p>
      ) : null}

      <div className="flex items-center justify-between border-t border-stone-200 pt-4">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
          className="rounded-md border border-stone-300 px-4 py-2 font-semibold text-stone-700 transition hover:border-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        {isLastQuestion ? (
          <button
            type="button"
            disabled={isSubmitting || answeredCount !== quiz.questions.length}
            onClick={submit}
            className="rounded-md bg-amber-500 px-5 py-2 font-semibold text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit attempt"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((index) => Math.min(index + 1, quiz.questions.length - 1))
            }
            className="rounded-md bg-stone-950 px-5 py-2 font-semibold text-white transition hover:bg-stone-800"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
