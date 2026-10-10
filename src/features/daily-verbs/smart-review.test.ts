
import { describe, expect, test } from "vitest";
import { selectSmartReview } from "./smart-review";
import type { VerbMastery } from "./verb-mastery";

const dates = [
  "2026-10-01",
  "2026-10-03",
  "2026-10-07",
  "2026-10-14",
  "2026-10-30",
];

function createVerb(
  verbId: string,
  sessions: number,
  needsReinforcement = false
): VerbMastery {
  return {
    studentId: "student-001",
    verbId,
    successfulReviewDates: dates.slice(0, sessions),
    needsReinforcement,
  };
}

describe("Repaso inteligente de verbos", () => {
  test("Selecciona un máximo de cinco verbos", () => {
    const verbs = [
      createVerb("go", 1),
      createVerb("eat", 2),
      createVerb("work", 3),
      createVerb("buy", 4),
      createVerb("drive", 1),
      createVerb("make", 2),
    ];

    expect(selectSmartReview(verbs)).toHaveLength(5);
  });

  test("Prioriza verbos con errores pendientes", () => {
    const verbs = [
      createVerb("go", 1),
      createVerb("eat", 4, true),
      createVerb("work", 2),
    ];

    const result = selectSmartReview(verbs);

    expect(result[0].verbId).toBe("eat");
  });

  test("Excluye verbos completamente dominados", () => {
    const verbs = [
      createVerb("go", 5),
      createVerb("eat", 2),
      createVerb("work", 3),
    ];

    const result = selectSmartReview(verbs);

    expect(result.map((verb) => verb.verbId)).not.toContain("go");
    expect(result).toHaveLength(2);
  });

  test("Prioriza menor cantidad de sesiones correctas", () => {
    const verbs = [
      createVerb("work", 3),
      createVerb("buy", 1),
      createVerb("eat", 2),
    ];

    const result = selectSmartReview(verbs);

    expect(result.map((verb) => verb.verbId)).toEqual([
      "buy",
      "eat",
      "work",
    ]);
  });

  test("Permite seleccionar diez verbos para un repaso general", () => {
    const verbs = Array.from({ length: 12 }, (_, index) =>
      createVerb(`verb-${index + 1}`, 1)
    );

    expect(selectSmartReview(verbs, 10)).toHaveLength(10);
  });

  test("Rechaza cantidades inválidas", () => {
    expect(() => selectSmartReview([], 0)).toThrow();
    expect(() => selectSmartReview([], -1)).toThrow();
  });
});
