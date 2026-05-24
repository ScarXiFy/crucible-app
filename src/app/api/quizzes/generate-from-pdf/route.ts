import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { requireRouteUser } from "@/lib/api";
import {
  buildQuizGenerationPrompt,
  classifyPdfExtractionError,
  extractResponseOutputText,
  generatedQuizSchema,
  normalizeGeneratedQuestions,
} from "@/lib/quiz-generation";

export const runtime = "nodejs";

const MAX_PDF_BYTES = 8 * 1024 * 1024;
const MAX_PDF_TEXT_CHARS = 30_000;

export async function POST(request: Request) {
  const { response } = await requireRouteUser();

  if (response) {
    return response;
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("pdf");
  const title = stringValue(formData.get("title"));
  const subject = stringValue(formData.get("subject"));
  const description = stringValue(formData.get("description"));
  const requestedCount = Number(stringValue(formData.get("questionCount")) || 8);
  const questionCount = Number.isFinite(requestedCount)
    ? Math.min(Math.max(Math.round(requestedCount), 3), 20)
    : 8;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a PDF file first." }, { status: 400 });
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
  }

  if (file.size > MAX_PDF_BYTES) {
    return NextResponse.json({ error: "PDF must be 8 MB or smaller." }, { status: 400 });
  }

  let pdfText: string;

  try {
    pdfText = await extractPdfText(file);
  } catch (error) {
    return NextResponse.json(
      { error: classifyPdfExtractionError(error) },
      { status: 400 },
    );
  }

  if (pdfText.length < 300) {
    return NextResponse.json(
      { error: "Could not find enough readable text in that PDF." },
      { status: 400 },
    );
  }

  let aiPayload: unknown;

  try {
    aiPayload = await generateQuestions({
      title,
      subject,
      description,
      questionCount,
      pdfText: pdfText.slice(0, MAX_PDF_TEXT_CHARS),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "OpenAI could not generate questions from that PDF.",
      },
      { status: 502 },
    );
  }

  const questions = normalizeGeneratedQuestions(aiPayload);

  if (questions.length === 0) {
    return NextResponse.json(
      { error: "The PDF was readable, but no usable questions were generated." },
      { status: 502 },
    );
  }

  return NextResponse.json({ questions });
}

async function extractPdfText(file: File) {
  const parser = new PDFParse({ data: new Uint8Array(await file.arrayBuffer()) });

  try {
    const result = await parser.getText();
    return result.text.replace(/\s+/g, " ").trim();
  } finally {
    await parser.destroy();
  }
}

async function generateQuestions({
  title,
  subject,
  description,
  questionCount,
  pdfText,
}: {
  title: string;
  subject: string;
  description: string;
  questionCount: number;
  pdfText: string;
}) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions:
        "You create accurate multiple-choice quiz drafts from source material. Use only the provided PDF text.",
      input: buildQuizGenerationPrompt({
        title,
        subject,
        description,
        questionCount,
        pdfText,
      }),
      max_output_tokens: 4000,
      text: {
        format: {
          type: "json_schema",
          name: "generated_quiz_questions",
          strict: true,
          schema: generatedQuizSchema,
        },
      },
    }),
  });

  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    const message = extractOpenAIError(payload);
    throw new Error(message || "OpenAI could not generate questions.");
  }

  const outputText = extractResponseOutputText(payload);

  try {
    return JSON.parse(outputText) as unknown;
  } catch {
    return {};
  }
}

function extractOpenAIError(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return null;
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
