import type { Json, QuizQuestion } from "@/lib/types";

export type SubmittedAnswers = Record<string, string>;

function normalizeTextAnswer(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function scoreQuiz(
  questions: Pick<QuizQuestion, "id" | "options">[],
  answers: SubmittedAnswers,
) {
  return questions.reduce(
    (result, question) => {
      const chosenOptionId = answers[question.id];
      const correctOption = question.options.find((option) => option.is_correct);
      const isIdentificationQuestion = question.options.length === 1;

      if (
        correctOption &&
        (chosenOptionId === correctOption.id ||
          (isIdentificationQuestion &&
            normalizeTextAnswer(chosenOptionId ?? "") === normalizeTextAnswer(correctOption.label)))
      ) {
        result.score += 1;
      }

      result.answerKey[question.id] = {
        selectedOptionId: isIdentificationQuestion ? null : chosenOptionId ?? null,
        textAnswer: isIdentificationQuestion ? chosenOptionId ?? null : null,
        correctOptionId: correctOption?.id ?? null,
      };

      return result;
    },
    {
      score: 0,
      total: questions.length,
      answerKey: {} as Record<
        string,
        { selectedOptionId: string | null; textAnswer: string | null; correctOptionId: string | null }
      >,
    },
  );
}

export function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}
