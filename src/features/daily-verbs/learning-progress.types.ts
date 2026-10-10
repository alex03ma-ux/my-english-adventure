
export interface StudentDailyProgress {
  studentId: string;
  currentDay: number;
  completedDays: number[];
  lastCompletedAt?: string;
}

export interface DailyLearningAssignment {
  id: string;
  studentId: string;
  dayNumber: number;
  verbIds: string[];
  status: "pending" | "in-progress" | "completed";
  assignedAt: string;
  completedAt?: string;
}

export interface VerbReview {
  studentId: string;
  verbId: string;
  nextReviewAt: string;
  correctAttempts: number;
  incorrectAttempts: number;
  masteryLevel: number;
}
