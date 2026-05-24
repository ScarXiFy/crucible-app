export const navItems = [
  { href: "#start", label: "Start" },
  { href: "#study-loop", label: "Review" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/auth", label: "Login" },
] as const;

export const heroCopy = {
  heading: "Study without the noise.",
  body: "Crucible turns short quizzes into a simple rhythm: topic, answer, result, next review.",
  primaryCta: { href: "/auth", label: "Start a quiz" },
  secondaryCta: { href: "#study-loop", label: "See the loop" },
} as const;

export const studyLoopSteps = [
  {
    title: "Topic",
    body: "Begin with one focused subject instead of a crowded study plan.",
  },
  {
    title: "Attempt",
    body: "Move through questions in a calm flow with only the choices that matter.",
  },
  {
    title: "Result",
    body: "Use saved attempts to see what needs another pass before the next session.",
  },
] as const;

export const audienceSections = [
  {
    title: "For learners",
    body: "Practice stays direct: pick a quiz, answer carefully, and return to the exact gaps your results expose.",
  },
  {
    title: "For quiz creators",
    body: "Build focused quizzes with clear questions, answer options, and a dashboard that keeps publishing practical.",
  },
] as const;

export const finalCta = {
  heading: "Ready for the next question?",
  body: "Sign in and turn the next review session into a small, useful loop.",
  href: "/auth",
  label: "Start now",
} as const;
