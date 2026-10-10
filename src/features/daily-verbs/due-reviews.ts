
import { selectSmartReview } from "./smart-review";
import { isReviewDue } from "./review-schedule";

import type { VerbMastery } from "./verb-mastery";

export interface VerbReviewCandidate {
  mastery: VerbMastery;
  learnedAt: string;
}

export function selectDueReviews(
  candidates: VerbReviewCandidate[],
  today: string,
  reviewSize = 5
): VerbReviewCandidate[] {
  if (!Number.isInteger(reviewSize) || reviewSize < 1) {
    throw new Error(
      "La cantidad de verbos para repasar debe ser positiva."
    );
  }

  const dueCandidates = candidates.filter((candidate) =>
    isReviewDue(
      candidate.mastery,
      candidate.learnedAt,
      today
    )
  );

  const prioritizedMasteries = selectSmartReview(
    dueCandidates.map((candidate) => candidate.mastery),
    reviewSize
  );

  return prioritizedMasteries.map((mastery) => {
    const candidate = dueCandidates.find(
      (item) => item.mastery === mastery
    );

    if (!candidate) {
      throw new Error("No se encontró el verbo seleccionado.");
    }

    return candidate;
  });
}
