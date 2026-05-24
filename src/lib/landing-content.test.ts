import { describe, expect, it } from "vitest";
import { audienceSections, finalCta, heroCopy, navItems, studyLoopSteps } from "./landing-content";

describe("landing content", () => {
  it("uses the approved minimal hero message and primary routes", () => {
    expect(heroCopy.heading).toBe("Study without the noise.");
    expect(heroCopy.primaryCta).toEqual({ href: "/auth", label: "Start a quiz" });
    expect(heroCopy.secondaryCta).toEqual({ href: "#study-loop", label: "See the loop" });
  });

  it("keeps the landing navigation sparse", () => {
    expect(navItems).toEqual([
      { href: "#start", label: "Start" },
      { href: "#study-loop", label: "Review" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/auth", label: "Login" },
    ]);
  });

  it("explains the review loop in three steps", () => {
    expect(studyLoopSteps.map((step) => step.title)).toEqual(["Topic", "Attempt", "Result"]);
    expect(studyLoopSteps).toHaveLength(3);
  });

  it("keeps downstream sections focused on learners and creators", () => {
    expect(audienceSections.map((section) => section.title)).toEqual([
      "For learners",
      "For quiz creators",
    ]);
    expect(finalCta.href).toBe("/auth");
  });
});
