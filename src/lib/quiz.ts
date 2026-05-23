import type { Json, QuizQuestion } from "@/lib/types";

export type SubmittedAnswers = Record<string, string>;

export function scoreQuiz(
  questions: Pick<QuizQuestion, "id" | "options">[],
  answers: SubmittedAnswers,
) {
  return questions.reduce(
    (result, question) => {
      const chosenOptionId = answers[question.id];
      const correctOption = question.options.find((option) => option.is_correct);

      if (correctOption && chosenOptionId === correctOption.id) {
        result.score += 1;
      }

      result.answerKey[question.id] = {
        selectedOptionId: chosenOptionId ?? null,
        correctOptionId: correctOption?.id ?? null,
      };

      return result;
    },
    {
      score: 0,
      total: questions.length,
      answerKey: {} as Record<
        string,
        { selectedOptionId: string | null; correctOptionId: string | null }
      >,
    },
  );
}

export function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}
