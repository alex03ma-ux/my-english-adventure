
import {
  getMasteryProgress,
  isVerbMastered,
} from "./verb-mastery";

import type { VerbMastery } from "./verb-mastery";

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

function parseDate(date: string): Date {
  const day = date.slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    throw new Error("Formato de fecha inválido.");
  }

  const parsed = new Date(`${day}T12:00:00Z`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== day
  ) {
    throw new Error("Fecha inválida.");
  }

  return parsed;
}

export function getNextReviewDate(
  mastery: VerbMastery,
  learnedAt: string
): string | null {
  if (isVerbMastered(mastery)) {
    return null;
  }

  const completedSessions = getMasteryProgress(mastery);

  const interval = REVIEW_INTERVALS[completedSessions];

  if (interval === undefined) {
    return null;
  }

  const lastReviewDate =
    mastery.successfulReviewDates.length > 0
      ? [...mastery.successfulReviewDates].sort().at(-1)!
      : learnedAt;

  const baseDate = parseDate(lastReviewDate);

  baseDate.setUTCDate(baseDate.getUTCDate() + interval);

  return baseDate.toISOString().slice(0, 10);
}

export function isReviewDue(
  mastery: VerbMastery,
  learnedAt: string,
  today: string
): boolean {
  const nextReviewDate = getNextReviewDate(
    mastery,
    learnedAt
  );

  if (nextReviewDate === null) {
    return false;
  }

  const currentDate = parseDate(today);

  return (
    currentDate.toISOString().slice(0, 10) >=
    nextReviewDate
  );
}
