
import { describe, expect, test } from "vitest";

import {
  registerVerbReview,
  getMasteryProgress,
  isVerbMastered,
} from "./verb-mastery";

import type { VerbMastery } from "./verb-mastery";

describe("Dominio de verbos - cinco sesiones", () => {
  const initialMastery: VerbMastery = {
    studentId: "student-001",
    verbId: "drive",
    successfulReviewDates: [],
    needsReinforcement: false,
  };

  test("Registra la primera sesión correcta", () => {
    const result = registerVerbReview(
      initialMastery,
      "2026-10-01",
      true
    );

    expect(getMasteryProgress(result)).toBe(1);
  });

  test("No cuenta dos respuestas del mismo día como dos sesiones", () => {
    let result = registerVerbReview(
      initialMastery,
      "2026-10-01",
      true
    );

    result = registerVerbReview(
      result,
      "2026-10-01",
      true
    );

    expect(getMasteryProgress(result)).toBe(1);
  });

  test("Cuenta cinco sesiones en días diferentes", () => {
    let result = initialMastery;

    const dates = [
      "2026-10-01",
      "2026-10-03",
      "2026-10-07",
      "2026-10-14",
      "2026-10-30",
    ];

    for (const date of dates) {
      result = registerVerbReview(result, date, true);
    }

    expect(getMasteryProgress(result)).toBe(5);
    expect(isVerbMastered(result)).toBe(true);
  });

  test("Un error marca el verbo para refuerzo", () => {
    const result = registerVerbReview(
      initialMastery,
      "2026-10-02",
      false
    );

    expect(result.needsReinforcement).toBe(true);
    expect(isVerbMastered(result)).toBe(false);
  });

  test("Un acierto posterior resuelve la marca de refuerzo", () => {
    const incorrect = registerVerbReview(
      initialMastery,
      "2026-10-02",
      false
    );

    const corrected = registerVerbReview(
      incorrect,
      "2026-10-03",
      true
    );

    expect(corrected.needsReinforcement).toBe(false);
    expect(getMasteryProgress(corrected)).toBe(1);
  });

  test("No declara dominio con menos de cinco sesiones", () => {
    let result = initialMastery;

    for (const date of [
      "2026-10-01",
      "2026-10-03",
      "2026-10-07",
      "2026-10-14",
    ]) {
      result = registerVerbReview(result, date, true);
    }

    expect(isVerbMastered(result)).toBe(false);
  });
});
