"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DraftOption = {
  label: string;
  isCorrect: boolean;
};

export function AdminQuizForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [quizId, setQuizId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState<DraftOption[]>([
    { label: "", isCorrect: true },
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
  ]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);

  async function createQuiz(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSavingQuiz(true);

    const response = await fetch("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subject, description }),
    });
    const payload = (await response.json()) as { id?: string; error?: string };

    if (!response.ok || !payload.id) {
      setMessage(payload.error || "Could not create quiz.");
    } else {
      setQuizId(payload.id);
      setMessage("Quiz created. Add the first question below.");
      router.refresh();
    }

    setIsSavingQuiz(false);
  }

  async function addQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSavingQuestion(true);

    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId,
        prompt,
        options,
      }),
    });
    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessage(payload.error || "Could not add question.");
    } else {
      setPrompt("");
      setOptions([
        { label: "", isCorrect: true },
        { label: "", isCorrect: false },
        { label: "", isCorrect: false },
        { label: "", isCorrect: false },
      ]);
      setMessage("Question added.");
      router.refresh();
    }

    setIsSavingQuestion(false);
  }

  function updateOption(index: number, value: Partial<DraftOption>) {
    setOptions((current) =>
      current.map((option, optionIndex) => {
        if (optionIndex !== index) {
          return value.isCorrect ? { ...option, isCorrect: false } : option;
        }

        return { ...option, ...value };
      }),
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={createQuiz} className="border border-stone-300 bg-white p-6">
        <h2 className="text-2xl font-semibold">Create quiz</h2>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Title</span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full border border-stone-300 px-3 py-3 outline-none focus:border-stone-950"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Subject</span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="mt-2 w-full border border-stone-300 px-3 py-3 outline-none focus:border-stone-950"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 min-h-28 w-full border border-stone-300 px-3 py-3 outline-none focus:border-stone-950"
            />
          </label>
          <button
            disabled={isSavingQuiz}
            className="rounded-md bg-stone-950 px-5 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
          >
            {isSavingQuiz ? "Creating..." : "Create quiz"}
          </button>
        </div>
      </form>

      <form onSubmit={addQuestion} className="border border-stone-300 bg-white p-6">
        <h2 className="text-2xl font-semibold">Add question</h2>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Quiz ID</span>
            <input
              required
              value={quizId}
              onChange={(event) => setQuizId(event.target.value)}
              className="mt-2 w-full border border-stone-300 px-3 py-3 font-mono text-sm outline-none focus:border-stone-950"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Question</span>
            <textarea
              required
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="mt-2 min-h-24 w-full border border-stone-300 px-3 py-3 outline-none focus:border-stone-950"
            />
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="grid grid-cols-[1fr_auto] gap-3">
                <input
                  required
                  value={option.label}
                  onChange={(event) => updateOption(index, { label: event.target.value })}
                  placeholder={`Option ${index + 1}`}
                  className="border border-stone-300 px-3 py-3 outline-none focus:border-stone-950"
                />
                <label className="flex items-center gap-2 border border-stone-300 px-3 text-sm font-semibold">
                  <input
                    type="radio"
                    name="correct"
                    checked={option.isCorrect}
                    onChange={() => updateOption(index, { isCorrect: true })}
                  />
                  Correct
                </label>
              </div>
            ))}
          </div>
          {message ? (
            <p className="border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {message}
            </p>
          ) : null}
          <button
            disabled={isSavingQuestion}
            className="rounded-md bg-amber-500 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-400 disabled:opacity-50"
          >
            {isSavingQuestion ? "Adding..." : "Add question"}
          </button>
        </div>
      </form>
    </div>
  );
}
