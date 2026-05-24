export type GeneratedOption = {
  label: string;
  isCorrect: boolean;
};

export type GeneratedQuestion = {
  prompt: string;
  options: GeneratedOption[];
};

type RawGeneratedQuestion = {
  prompt?: unknown;
  options?: unknown;
};

type RawGeneratedOption = {
  label?: unknown;
  isCorrect?: unknown;
};

export const generatedQuizSchema = {
  type: "object",
  additionalProperties: false,
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["prompt", "options"],
        properties: {
          prompt: { type: "string" },
          options: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["label", "isCorrect"],
              properties: {
                label: { type: "string" },
                isCorrect: { type: "boolean" },
              },
            },
          },
        },
      },
    },
  },
} as const;

export function normalizeGeneratedQuestions(payload: unknown): GeneratedQuestion[] {
  if (!isObject(payload) || !Array.isArray(payload.questions)) {
    return [];
  }

  return payload.questions.flatMap((question) => {
    const normalized = normalizeQuestion(question as RawGeneratedQuestion);
    return normalized ? [normalized] : [];
  });
}

export function buildQuizGenerationPrompt({
  title,
  subject,
  description,
  questionCount,
  pdfText,
}: {
  title: string;
  subject?: string;
  description?: string;
  questionCount: number;
  pdfText: string;
}) {
  const context = [
    `Quiz title: ${title.trim() || "Untitled quiz"}`,
    subject?.trim() ? `Subject: ${subject.trim()}` : null,
    description?.trim() ? `Description: ${description.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `${context}

Generate ${questionCount} multiple-choice quiz questions from the PDF text below.
Each question must have 4 concise answer choices and exactly one correct answer.
Prefer questions that test understanding instead of asking for tiny details.

PDF text:
${pdfText.trim()}`;
}

export function extractResponseOutputText(payload: unknown): string {
  if (!isObject(payload)) {
    return "";
  }

  if (typeof payload.output_text === "string") {
    return payload.output_text;
  }

  if (!Array.isArray(payload.output)) {
    return "";
  }

  return payload.output
    .flatMap((item) => (isObject(item) && Array.isArray(item.content) ? item.content : []))
    .map((content) => {
      if (!isObject(content)) {
        return "";
      }

      if (typeof content.text === "string") {
        return content.text;
      }

      return "";
    })
    .join("");
}

export function classifyPdfExtractionError(error: unknown) {
  const name = getErrorField(error, "name");
  const message = getErrorField(error, "message").toLowerCase();

  if (name === "PasswordException" || message.includes("password")) {
    return "That PDF is password-protected. Remove the password and upload it again.";
  }

  if (name === "InvalidPDFException" || message.includes("invalid pdf")) {
    return "That PDF looks damaged or is not a valid PDF file.";
  }

  if (name === "FormatError" || message.includes("format")) {
    return "That PDF uses a format the text parser could not read.";
  }

  return "Could not read text from that PDF. It may be encrypted, damaged, or saved in a format the parser cannot read.";
}

function normalizeQuestion(question: RawGeneratedQuestion): GeneratedQuestion | null {
  if (typeof question.prompt !== "string" || !Array.isArray(question.options)) {
    return null;
  }

  const prompt = question.prompt.trim();
  const options = question.options
    .map((option) => normalizeOption(option as RawGeneratedOption))
    .filter((option): option is GeneratedOption => option !== null)
    .slice(0, 4);

  if (!prompt || options.length < 2) {
    return null;
  }

  const firstCorrectIndex = options.findIndex((option) => option.isCorrect);
  if (firstCorrectIndex === -1) {
    return null;
  }

  return {
    prompt,
    options: options.map((option, index) => ({
      ...option,
      isCorrect: index === firstCorrectIndex,
    })),
  };
}

function normalizeOption(option: RawGeneratedOption): GeneratedOption | null {
  if (typeof option.label !== "string") {
    return null;
  }

  const label = option.label.trim();
  if (!label) {
    return null;
  }

  return {
    label,
    isCorrect: option.isCorrect === true,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorField(error: unknown, field: "message" | "name") {
  if (isObject(error) && field in error) {
    const value = error[field];
    return typeof value === "string" ? value : "";
  }

  return "";
}
