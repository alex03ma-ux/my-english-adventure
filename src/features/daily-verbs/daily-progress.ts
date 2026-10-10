
import type {
  StudentDailyProgress,
  DailyLearningAssignment,
} from "./learning-progress.types";

export const VERBS_PER_DAY = 5;

export function getCurrentLearningDay(
  progress: StudentDailyProgress
): number {
  return progress.currentDay;
}

export function canStartNextDay(
  progress: StudentDailyProgress
): boolean {
  if (progress.currentDay <= 1) {
    return true;
  }

  return progress.completedDays.includes(
    progress.currentDay - 1
  );
}

export function validateDailyAssignment(
  assignment: DailyLearningAssignment
): boolean {
  const uniqueVerbs = new Set(assignment.verbIds);

  return (
    assignment.verbIds.length === VERBS_PER_DAY &&
    uniqueVerbs.size === VERBS_PER_DAY
  );
}

export function completeLearningDay(
  progress: StudentDailyProgress
): StudentDailyProgress {
  if (!canStartNextDay(progress)) {
    throw new Error(
      "Debes completar el día anterior antes de avanzar."
    );
  }

  if (progress.completedDays.includes(progress.currentDay)) {
    throw new Error("Este día ya fue completado.");
  }

  return {
    ...progress,
    completedDays: [
      ...progress.completedDays,
      progress.currentDay,
    ],
    currentDay: progress.currentDay + 1,
    lastCompletedAt: new Date().toISOString(),
  };
}
