import { describe, expect, it } from "vitest";
import {
  buildQuizGenerationPrompt,
  classifyPdfExtractionError,
  extractResponseOutputText,
  normalizeGeneratedQuestions,
} from "./quiz-generation";

describe("normalizeGeneratedQuestions", () => {
  it("keeps valid multiple-choice questions and marks one correct answer", () => {
    const questions = normalizeGeneratedQuestions({
      questions: [
        {
          prompt: " What is heat transfer? ",
          options: [
            { label: "Energy moving because of temperature difference", isCorrect: true },
            { label: "A type of mass", isCorrect: false },
            { label: "A unit of pressure", isCorrect: false },
            { label: "A chemical bond", isCorrect: false },
          ],
        },
      ],
    });

    expect(questions).toEqual([
      {
        prompt: "What is heat transfer?",
        options: [
          { label: "Energy moving because of temperature difference", isCorrect: true },
          { label: "A type of mass", isCorrect: false },
          { label: "A unit of pressure", isCorrect: false },
          { label: "A chemical bond", isCorrect: false },
        ],
      },
    ]);
  });

  it("drops incomplete questions and fixes duplicate correct answers", () => {
    const questions = normalizeGeneratedQuestions({
      questions: [
        {
          prompt: "Valid question?",
          options: [
            { label: "Correct A", isCorrect: true },
            { label: "Correct B", isCorrect: true },
            { label: "Wrong C", isCorrect: false },
          ],
        },
        {
          prompt: "No correct answer?",
          options: [
            { label: "Wrong A", isCorrect: false },
            { label: "Wrong B", isCorrect: false },
          ],
        },
      ],
    });

    expect(questions).toEqual([
      {
        prompt: "Valid question?",
        options: [
          { label: "Correct A", isCorrect: true },
          { label: "Correct B", isCorrect: false },
          { label: "Wrong C", isCorrect: false },
        ],
      },
    ]);
  });
});

describe("buildQuizGenerationPrompt", () => {
  it("includes quiz context, requested count, and trimmed PDF text", () => {
    const prompt = buildQuizGenerationPrompt({
      title: "Physics Review",
      subject: "Science",
      description: "Chapter 4",
      questionCount: 5,
      pdfText: "  The lesson text.  ",
    });

    expect(prompt).toContain("Physics Review");
    expect(prompt).toContain("Science");
    expect(prompt).toContain("Chapter 4");
    expect(prompt).toContain("Generate 5");
    expect(prompt).toContain("The lesson text.");
  });
});

describe("extractResponseOutputText", () => {
  it("reads text from a Responses API output payload", () => {
    const text = extractResponseOutputText({
      output: [
        {
          content: [
            { type: "output_text", text: "{\"questions\":[]}" },
          ],
        },
      ],
    });

    expect(text).toBe("{\"questions\":[]}");
  });

  it("falls back to output_text when present", () => {
    expect(extractResponseOutputText({ output_text: "hello" })).toBe("hello");
  });
});

describe("classifyPdfExtractionError", () => {
  it("explains password-protected PDFs", () => {
    expect(classifyPdfExtractionError({ name: "PasswordException" })).toBe(
      "That PDF is password-protected. Remove the password and upload it again.",
    );
  });

  it("explains invalid or damaged PDFs", () => {
    expect(classifyPdfExtractionError({ name: "InvalidPDFException" })).toBe(
      "That PDF looks damaged or is not a valid PDF file.",
    );
  });

  it("keeps a safe fallback for unknown parser failures", () => {
    expect(classifyPdfExtractionError(new Error("oops"))).toBe(
      "Could not read text from that PDF. It may be encrypted, damaged, or saved in a format the parser cannot read.",
    );
  });
});
