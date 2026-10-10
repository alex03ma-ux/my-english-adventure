
export type ExerciseType =
  | "multiple-choice"
  | "fill-in-the-blank"
  | "translation"
  | "word-order"
  | "listening";

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface DailyVerbExercise {
  id: string;
  verbId: string;
  type: ExerciseType;
  question: string;
  options?: ExerciseOption[];
  correctAnswer: string;
  explanation?: string;
}

export interface ExerciseAttempt {
  exerciseId: string;
  studentAnswer: string;
  isCorrect: boolean;
  attemptedAt: string;
}

export interface DailyPracticeResult {
  lessonId: string;
  totalQuestions: number;
  correctAnswers: number;
  attempts: ExerciseAttempt[];
}
