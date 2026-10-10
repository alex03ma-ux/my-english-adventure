
import { describe, expect, test } from "vitest";

import {
  canStartNextDay,
  completeLearningDay,
  validateDailyAssignment,
} from "./daily-progress";

import type {
  StudentDailyProgress,
  DailyLearningAssignment,
} from "./learning-progress.types";

describe("Programa de cinco verbos diarios", () => {
  const student: StudentDailyProgress = {
    studentId: "student-001",
    currentDay: 1,
    completedDays: [],
  };

  test("Debe aceptar cinco verbos diferentes", () => {
    const assignment: DailyLearningAssignment = {
      id: "assignment-001",
      studentId: "student-001",
      dayNumber: 1,
      verbIds: ["go", "eat", "work", "buy", "drive"],
      status: "pending",
      assignedAt: new Date().toISOString(),
    };

    expect(validateDailyAssignment(assignment)).toBe(true);
  });

  test("Debe rechazar verbos repetidos", () => {
    const assignment: DailyLearningAssignment = {
      id: "assignment-002",
      studentId: "student-001",
      dayNumber: 1,
      verbIds: ["go", "eat", "work", "buy", "go"],
      status: "pending",
      assignedAt: new Date().toISOString(),
    };

    expect(validateDailyAssignment(assignment)).toBe(false);
  });

  test("Debe permitir comenzar el día 1", () => {
    expect(canStartNextDay(student)).toBe(true);
  });

  test("Debe avanzar al día 2 después de completar el día 1", () => {
    const result = completeLearningDay(student);

    expect(result.currentDay).toBe(2);
    expect(result.completedDays).toContain(1);
  });

  test("No debe permitir saltarse días anteriores", () => {
    const studentWithPendingDay: StudentDailyProgress = {
      studentId: "student-002",
      currentDay: 3,
      completedDays: [1],
    };

    expect(canStartNextDay(studentWithPendingDay)).toBe(false);
  });
});
