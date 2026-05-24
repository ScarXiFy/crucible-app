import { describe, expect, it } from "vitest";
import { scoreQuiz } from "./quiz";
import type { QuizQuestion } from "./types";

function question(options: QuizQuestion["options"]): Pick<QuizQuestion, "id" | "options"> {
  return {
    id: "question-1",
    options,
  };
}

describe("scoreQuiz", () => {
  it("scores identification answers by matching the correct option label", () => {
    const result = scoreQuiz(
      [
        question([
          {
            id: "answer-1",
            question_id: "question-1",
            label: "Central Processing Unit",
            is_correct: true,
            position: 1,
            created_at: "2026-05-23T00:00:00.000Z",
          },
        ]),
      ],
      {
        "question-1": " central processing unit ",
      },
    );

    expect(result.score).toBe(1);
  });
});
