
import { describe, expect, test } from "vitest";

import {
  getNextReviewDate,
  isReviewDue,
} from "./review-schedule";

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

describe("Calendario de repasos de verbos", () => {
  test("Programa el primer repaso un día después", () => {
    const mastery = createMastery();

    expect(
      getNextReviewDate(mastery, "2026-10-01")
    ).toBe("2026-10-02");
  });

  test("Programa el segundo repaso tres días después del primero", () => {
    const mastery = createMastery(["2026-10-02"]);

    expect(
      getNextReviewDate(mastery, "2026-10-01")
    ).toBe("2026-10-05");
  });

  test("Programa el tercer repaso siete días después del segundo", () => {
    const mastery = createMastery([
      "2026-10-02",
      "2026-10-05",
    ]);

    expect(
      getNextReviewDate(mastery, "2026-10-01")
    ).toBe("2026-10-12");
  });

  test("No considera pendiente un repaso antes de su fecha", () => {
    const mastery = createMastery();

    expect(
      isReviewDue(mastery, "2026-10-01", "2026-10-01")
    ).toBe(false);
  });

  test("Detecta un repaso cuando llega su fecha", () => {
    const mastery = createMastery();

    expect(
      isReviewDue(mastery, "2026-10-01", "2026-10-02")
    ).toBe(true);
  });

  test("Detecta repasos atrasados", () => {
    const mastery = createMastery();

    expect(
      isReviewDue(mastery, "2026-10-01", "2026-10-10")
    ).toBe(true);
  });

  test("No programa repasos para un verbo dominado", () => {
    const mastery = createMastery([
      "2026-10-02",
      "2026-10-05",
      "2026-10-12",
      "2026-10-26",
      "2026-11-25",
    ]);

    expect(
      getNextReviewDate(mastery, "2026-10-01")
    ).toBeNull();
  });

  test("Rechaza fechas de aprendizaje inválidas", () => {
    const mastery = createMastery();

    expect(() =>
      getNextReviewDate(mastery, "2026-02-30")
    ).toThrow();
  });
});
