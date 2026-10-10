
import {
  getMasteryProgress,
  isVerbMastered,
} from "./verb-mastery";

import type { VerbMastery } from "./verb-mastery";

export const DEFAULT_REVIEW_SIZE = 5;

export function selectSmartReview(
  verbMasteries: VerbMastery[],
  reviewSize: number = DEFAULT_REVIEW_SIZE
): VerbMastery[] {
  if (!Number.isInteger(reviewSize) || reviewSize < 1) {
    throw new Error(
      "La cantidad de verbos para repasar debe ser positiva."
    );
  }

  return verbMasteries
    .filter((verb) => !isVerbMastered(verb))
    .sort((a, b) => {
      if (a.needsReinforcement !== b.needsReinforcement) {
        return a.needsReinforcement ? -1 : 1;
      }

      return (
        getMasteryProgress(a) -
        getMasteryProgress(b)
      );
    })
    .slice(0, reviewSize);
}
