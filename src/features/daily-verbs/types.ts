
export type VerbTense = "present" | "past" | "future";

export interface VerbForm {
  tense: VerbTense;
  text: string;
}

export interface VerbExample {
  id: string;
  english: string;
  spanish: string;
  tense: VerbTense;
}

export interface DailyVerb {
  id: string;
  baseForm: string;
  translation: string;
  pronunciation?: string;
  forms: VerbForm[];
  examples: VerbExample[];
}

export interface DailyVerbLesson {
  id: string;
  dayNumber: number;
  verbs: DailyVerb[];
}

export interface DailyVerbProgress {
  lessonId: string;
  completedVerbIds: string[];
  completed: boolean;
  lastPracticedAt?: string;
}
