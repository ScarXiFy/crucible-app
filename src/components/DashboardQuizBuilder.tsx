"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type QuestionType = "multiple_choice" | "true_false" | "identification";

type DraftOption = {
  label: string;
  isCorrect: boolean;
};

type DraftQuestion = {
  prompt: string;
  type: QuestionType;
  options: DraftOption[];
};

const questionTypes: { label: string; value: QuestionType }[] = [
  { label: "Multiple choice", value: "multiple_choice" },
  { label: "True or false", value: "true_false" },
  { label: "Identification", value: "identification" },
];

const fieldClass =
  "mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-950 outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-100";

const quietButtonClass =
  "rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-950 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50";

const primaryButtonClass =
  "rounded-lg bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50";

function getInitialOptions(type: QuestionType): DraftOption[] {
  if (type === "true_false") {
    return [
      { label: "True", isCorrect: true },
      { label: "False", isCorrect: false },
    ];
  }

  if (type === "identification") {
    return [{ label: "", isCorrect: true }];
  }

  return [
    { label: "", isCorrect: true },
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
  ];
}

export function DashboardQuizBuilder() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("multiple_choice");
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState<DraftOption[]>(getInitialOptions("multiple_choice"));
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const canCreateQuiz = title.trim().length > 0 && questions.length > 0;
  const questionTypeLabel = useMemo(
    () => questionTypes.find((type) => type.value === questionType)?.label ?? "Question",
    [questionType],
  );

  function changeQuestionType(type: QuestionType) {
    setQuestionType(type);
    setOptions(getInitialOptions(type));
    setMessage(null);
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

  function addQuestion() {
    setMessage(null);

    const cleanPrompt = prompt.trim();
    const cleanOptions = options
      .map((option) => ({ label: option.label.trim(), isCorrect: option.isCorrect }))
      .filter((option) => option.label.length > 0);

    if (!cleanPrompt) {
      setMessage("Write the question first.");
      return;
    }

    if (questionType === "multiple_choice" && cleanOptions.length < 2) {
      setMessage("Add at least two answer choices.");
      return;
    }

    if (questionType === "identification" && !cleanOptions[0]?.label) {
      setMessage("Add the correct identification answer.");
      return;
    }

    if (!cleanOptions.some((option) => option.isCorrect)) {
      setMessage("Choose the correct answer.");
      return;
    }

    setQuestions((current) => [
      ...current,
      {
        prompt: cleanPrompt,
        type: questionType,
        options: cleanOptions,
      },
    ]);
    setPrompt("");
    setOptions(getInitialOptions(questionType));
  }

  function removeQuestion(index: number) {
    setQuestions((current) => current.filter((_, questionIndex) => questionIndex !== index));
  }

  async function createQuiz() {
    setMessage(null);

    if (!canCreateQuiz) {
      setMessage("Add a title and at least one question before creating the quiz.");
      return;
    }

    setIsSaving(true);

    try {
      const quizResponse = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
        }),
      });
      const quizPayload = (await quizResponse.json()) as { id?: string; error?: string };

      if (!quizResponse.ok || !quizPayload.id) {
        setMessage(quizPayload.error || "Could not create quiz.");
        return;
      }

      for (const question of questions) {
        const questionResponse = await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: quizPayload.id,
            prompt: question.prompt,
            options: question.options,
          }),
        });
        const questionPayload = (await questionResponse.json()) as { error?: string };

        if (!questionResponse.ok) {
          setMessage(questionPayload.error || "Quiz was created, but one question could not be saved.");
          router.refresh();
          return;
        }
      }

      router.push(`/quiz/${quizPayload.id}`);
      router.refresh();
    } catch {
      setMessage("Could not reach the quiz creator.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-stone-950">Quiz details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-stone-700">
            Title
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Computer Memory"
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-semibold text-stone-700">
            Subject
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Computer Organization"
              className={fieldClass}
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-stone-950">Questions</h2>
            <p className="mt-1 text-sm text-stone-600">Add questions now. Create the quiz when everything looks ready.</p>
          </div>
          <p className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700">
            {questions.length} added
          </p>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="block text-sm font-semibold text-stone-700">
            Question type
            <select
              value={questionType}
              onChange={(event) => changeQuestionType(event.target.value as QuestionType)}
              className={fieldClass}
            >
              {questionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-stone-700">
            Question
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="What should the learner answer?"
              className={`${fieldClass} min-h-28 resize-y leading-6`}
            />
          </label>

          {questionType === "identification" ? (
            <label className="block text-sm font-semibold text-stone-700">
              Correct answer
              <input
                value={options[0]?.label ?? ""}
                onChange={(event) => updateOption(0, { label: event.target.value, isCorrect: true })}
                placeholder="Central Processing Unit"
                className={fieldClass}
              />
            </label>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-stone-700">{questionTypeLabel} answers</p>
              {options.map((option, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[1fr_120px]">
                  <input
                    value={option.label}
                    onChange={(event) => updateOption(index, { label: event.target.value })}
                    readOnly={questionType === "true_false"}
                    placeholder={`Option ${index + 1}`}
                    className={fieldClass}
                  />
                  <label
                    className={`mt-2 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                      option.isCorrect
                        ? "border-stone-950 bg-stone-950 text-white"
                        : "border-stone-300 bg-white text-stone-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="correct"
                      checked={option.isCorrect}
                      onChange={() => updateOption(index, { isCorrect: true })}
                      className="accent-stone-950"
                    />
                    Correct
                  </label>
                </div>
              ))}
            </div>
          )}

          <div>
            <button type="button" onClick={addQuestion} className={quietButtonClass}>
              Add question
            </button>
          </div>
        </div>
      </section>

      {questions.length > 0 ? (
        <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-stone-950">Review questions</h2>
          <div className="mt-4 divide-y divide-stone-200">
            {questions.map((question, index) => (
              <div key={`${question.prompt}-${index}`} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-stone-500">
                    {index + 1}. {questionTypes.find((type) => type.value === question.type)?.label}
                  </p>
                  <p className="mt-1 font-semibold text-stone-950">{question.prompt}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    Answer: {question.options.find((option) => option.isCorrect)?.label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {message ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          {message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button type="button" onClick={createQuiz} disabled={isSaving || !canCreateQuiz} className={primaryButtonClass}>
          {isSaving ? "Creating quiz..." : "Create quiz"}
        </button>
      </div>
    </div>
  );
}
