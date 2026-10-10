
import { describe, expect, test } from "vitest";

import {
  selectDueReviews,
  type VerbReviewCandidate,
} from "./due-reviews";

function createCandidate(
  verbId: string,
  learnedAt: string,
  successfulReviewDates: string[] = [],
  needsReinforcement = false
): VerbReviewCandidate {
  return {
    learnedAt,
    mastery: {
      studentId: "student-001",
      verbId,
      successfulReviewDates,
      needsReinforcement,
    },
  };
}

describe("Selección de repasos pendientes", () => {
  test("Selecciona únicamente verbos con repaso vencido", () => {
    const candidates = [
      createCandidate("go", "2026-10-01"),
      createCandidate("eat", "2026-10-09"),
      createCandidate("work", "2026-10-05"),
    ];

    const result = selectDueReviews(
      candidates,
      "2026-10-09"
    );

    expect(result.map((item) => item.mastery.verbId)).toEqual([
      "go",
      "work",
    ]);
  });

  test("No muestra verbos completamente dominados", () => {
    const candidates = [
      createCandidate("go", "2026-10-01", [
        "2026-10-02",
        "2026-10-05",
        "2026-10-12",
        "2026-10-26",
        "2026-11-25",
      ]),
      createCandidate("eat", "2026-10-01"),
    ];

    const result = selectDueReviews(
      candidates,
      "2026-12-01"
    );

    expect(result.map((item) => item.mastery.verbId)).toEqual([
      "eat",
    ]);
  });

  test("Prioriza errores entre los repasos pendientes", () => {
    const candidates = [
      createCandidate("go", "2026-10-01"),
      createCandidate("eat", "2026-10-01", [], true),
      createCandidate("work", "2026-10-01"),
    ];

    const result = selectDueReviews(
      candidates,
      "2026-10-09"
    );

    expect(result[0].mastery.verbId).toBe("eat");
  });

  test("Respeta el límite de cinco verbos", () => {
    const candidates = Array.from(
      { length: 10 },
      (_, index) =>
        createCandidate(
          `verb-${index + 1}`,
          "2026-10-01"
        )
    );

    expect(
      selectDueReviews(candidates, "2026-10-09")
    ).toHaveLength(5);
  });

  test("Devuelve menos de cinco si hay pocos pendientes", () => {
    const candidates = [
      createCandidate("go", "2026-10-01"),
      createCandidate("eat", "2026-10-01"),
    ];

    expect(
      selectDueReviews(candidates, "2026-10-09")
    ).toHaveLength(2);
  });

  test("No obliga a repasar si no hay pendientes", () => {
    const candidates = [
      createCandidate("go", "2026-10-09"),
    ];

    expect(
      selectDueReviews(candidates, "2026-10-09")
    ).toEqual([]);
  });

  test("Permite elegir diez verbos para repaso general", () => {
    const candidates = Array.from(
      { length: 12 },
      (_, index) =>
        createCandidate(
          `verb-${index + 1}`,
          "2026-10-01"
        )
    );

    expect(
      selectDueReviews(candidates, "2026-10-09", 10)
    ).toHaveLength(10);
  });

  test("Rechaza cantidades de repaso inválidas", () => {
    expect(() =>
      selectDueReviews([], "2026-10-09", 0)
    ).toThrow();
  });
});
