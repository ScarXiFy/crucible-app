"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DraftOption = {
  label: string;
  isCorrect: boolean;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-stone-200 bg-[#fffdf8] px-4 py-3 font-bold text-stone-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100";

const labelClass = "text-sm font-bold text-stone-700";

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
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <form
        onSubmit={createQuiz}
        className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700">
              Step 1
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-normal text-stone-950">Quiz details</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Give students enough context before they start.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className={labelClass}>Title</span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Thermodynamics review"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Subject</span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Science"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short instructions or scope for this quiz."
              className={`${inputClass} min-h-32 resize-y leading-7`}
            />
          </label>
          <button
            disabled={isSavingQuiz}
            className="rounded-2xl bg-sky-500 px-5 py-3 font-bold text-white shadow-[6px_6px_0_#fbbf24] transition duration-200 hover:-translate-y-1 hover:bg-sky-600 hover:shadow-[9px_9px_0_#fbbf24] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingQuiz ? "Creating..." : "Create quiz"}
          </button>
        </div>
      </form>

      <form
        onSubmit={addQuestion}
        className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur sm:p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
              Step 2
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-normal text-stone-950">Add question</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Add four choices and mark exactly one correct answer.
            </p>
          </div>
          {quizId ? (
            <div className="rounded-2xl border border-stone-200 bg-[#fbf7ef] px-4 py-3">
              <p className="text-xs font-bold uppercase text-stone-400">Active quiz ID</p>
              <p className="mt-1 max-w-44 truncate font-mono text-xs font-bold text-stone-700">{quizId}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className={labelClass}>Quiz ID</span>
            <input
              required
              value={quizId}
              onChange={(event) => setQuizId(event.target.value)}
              placeholder="Created quiz ID appears here"
              className={`${inputClass} font-mono text-sm`}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Question</span>
            <textarea
              required
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="What should the learner answer?"
              className={`${inputClass} min-h-28 resize-y leading-7`}
            />
          </label>
          <div className="space-y-3">
            <p className={labelClass}>Answer choices</p>
            {options.map((option, index) => (
              <div key={index} className="grid gap-3 sm:grid-cols-[1fr_132px]">
                <input
                  required
                  value={option.label}
                  onChange={(event) => updateOption(index, { label: event.target.value })}
                  placeholder={`Option ${index + 1}`}
                  className={inputClass}
                />
                <label
                  className={`mt-2 flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                    option.isCorrect
                      ? "border-sky-200 bg-sky-50 text-sky-700"
                      : "border-stone-200 bg-[#fffdf8] text-stone-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="correct"
                    checked={option.isCorrect}
                    onChange={() => updateOption(index, { isCorrect: true })}
                    className="accent-sky-500"
                  />
                  Correct
                </label>
              </div>
            ))}
          </div>
          {message ? (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold leading-6 text-amber-900">
              {message}
            </p>
          ) : null}
          <button
            disabled={isSavingQuestion}
            className="rounded-2xl bg-stone-950 px-5 py-3 font-bold text-white transition duration-200 hover:-translate-y-1 hover:bg-stone-800 hover:shadow-[0_16px_35px_rgba(15,23,42,0.16)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingQuestion ? "Adding..." : "Add question"}
          </button>
        </div>
      </form>
    </div>
  );
}
