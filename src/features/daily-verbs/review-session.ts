
import {
  registerVerbReview,
  type VerbMastery,
} from "./verb-mastery";

export type ReviewSessionType =
  | "scheduled"
  | "voluntary";

export interface ReviewSessionResult {
  sessionType: ReviewSessionType;
  completedAt: string;
  allAnswersCorrect: boolean;
}

export function completeReviewSession(
  mastery: VerbMastery,
  session: ReviewSessionResult
): VerbMastery {
  if (session.sessionType === "voluntary") {
    return mastery;
  }

  return registerVerbReview(
    mastery,
    session.completedAt,
    session.allAnswersCorrect
  );
}
