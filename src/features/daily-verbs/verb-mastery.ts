
export const REQUIRED_MASTERY_SESSIONS = 5;

export interface VerbMastery {
  studentId: string;
  verbId: string;
  successfulReviewDates: string[];
  needsReinforcement: boolean;
}

export function registerVerbReview(
  mastery: VerbMastery,
  reviewDate: string,
  isCorrect: boolean
): VerbMastery {
  if (!isCorrect) {
    return {
      ...mastery,
      needsReinforcement: true,
    };
  }

  const reviewDay = reviewDate.slice(0, 10);

  const previousDates = new Set(
    mastery.successfulReviewDates
  );

  previousDates.add(reviewDay);

  return {
    ...mastery,
    successfulReviewDates: [...previousDates],
    needsReinforcement: false,
  };
}

export function getMasteryProgress(
  mastery: VerbMastery
): number {
  return Math.min(
    new Set(mastery.successfulReviewDates).size,
    REQUIRED_MASTERY_SESSIONS
  );
}

export function isVerbMastered(
  mastery: VerbMastery
): boolean {
  return (
    getMasteryProgress(mastery) >=
      REQUIRED_MASTERY_SESSIONS &&
    !mastery.needsReinforcement
  );
}
