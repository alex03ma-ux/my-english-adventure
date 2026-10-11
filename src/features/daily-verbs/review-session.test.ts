
import { describe, expect, test } from "vitest";

import { completeReviewSession } from "./review-session";
import type { VerbMastery } from "./verb-mastery";

function createMastery(
  dates: string[] = [],
  needsReinforcement = false
): VerbMastery {
  return {
    studentId: "student-001",
    verbId: "drive",
    successfulReviewDates: dates,
    needsReinforcement,
  };
}

describe("Control de sesiones de repaso", () => {
  test("Registra una sesión programada correcta", () => {
    const mastery = createMastery();

    const result = completeReviewSession(mastery, {
      sessionType: "scheduled",
      completedAt: "2026-10-10",
      allAnswersCorrect: true,
    });

    expect(result.successfulReviewDates).toEqual([
      "2026-10-10",
    ]);
    expect(result.needsReinforcement).toBe(false);
  });

  test("Un error marca el verbo para refuerzo", () => {
    const mastery = createMastery();

    const result = completeReviewSession(mastery, {
      sessionType: "scheduled",
      completedAt: "2026-10-10",
      allAnswersCorrect: false,
    });

    expect(result.needsReinforcement).toBe(true);
    expect(result.successfulReviewDates).toHaveLength(0);
  });

  test("Un error no borra sesiones correctas anteriores", () => {
    const mastery = createMastery([
      "2026-10-02",
      "2026-10-05",
      "2026-10-09",
    ]);

    const result = completeReviewSession(mastery, {
      sessionType: "scheduled",
      completedAt: "2026-10-10",
      allAnswersCorrect: false,
    });

    expect(result.successfulReviewDates).toHaveLength(3);
    expect(result.needsReinforcement).toBe(true);
  });

  test("Una sesión correcta posterior elimina la alerta", () => {
    const mastery = createMastery(
      ["2026-10-02", "2026-10-05"],
      true
    );

    const result = completeReviewSession(mastery, {
      sessionType: "scheduled",
      completedAt: "2026-10-10",
      allAnswersCorrect: true,
    });

    expect(result.successfulReviewDates).toHaveLength(3);
    expect(result.needsReinforcement).toBe(false);
  });

  test("Una práctica voluntaria no suma dominio", () => {
    const mastery = createMastery(["2026-10-02"]);

    const result = completeReviewSession(mastery, {
      sessionType: "voluntary",
      completedAt: "2026-10-10",
      allAnswersCorrect: true,
    });

    expect(result.successfulReviewDates).toEqual([
      "2026-10-02",
    ]);
  });

  test("Una práctica voluntaria no borra el refuerzo", () => {
    const mastery = createMastery(
      ["2026-10-02"],
      true
    );

    const result = completeReviewSession(mastery, {
      sessionType: "voluntary",
      completedAt: "2026-10-10",
      allAnswersCorrect: true,
    });

    expect(result.needsReinforcement).toBe(true);
  });

  test("Dos sesiones correctas el mismo día cuentan una vez", () => {
    const mastery = createMastery(["2026-10-10"]);

    const result = completeReviewSession(mastery, {
      sessionType: "scheduled",
      completedAt: "2026-10-10",
      allAnswersCorrect: true,
    });

    expect(result.successfulReviewDates).toHaveLength(1);
  });
});
