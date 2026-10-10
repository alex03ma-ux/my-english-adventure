
import { VERBS_PER_DAY } from "./daily-progress";

export function selectNewDailyVerbs(
  availableVerbIds: string[],
  learnedVerbIds: string[]
): string[] {
  const learned = new Set(learnedVerbIds);

  const available = [...new Set(availableVerbIds)].filter(
    (verbId) => !learned.has(verbId)
  );

  if (available.length < VERBS_PER_DAY) {
    throw new Error(
      "No hay suficientes verbos nuevos disponibles."
    );
  }

  return available.slice(0, VERBS_PER_DAY);
}
