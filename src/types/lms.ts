export type DifficultyLevel = "nhan_biet" | "thong_hieu" | "van_dung" | "van_dung_cao";

export type MathSkill =
  | "tim_uoc"
  | "tim_uoc_chung"
  | "tim_ucln_liet_ke"
  | "tim_ucln_tsnt"
  | "ucln_dac_biet"
  | "so_nguyen_to_cung_nhau"
  | "ung_dung_thuc_te"
  | "rut_gon_phan_so"
  | "toan_thuc_te_chia_phan";

export interface Question {
  id: string;
  content: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  level: DifficultyLevel;
  skill: MathSkill;
  commonMistake: string;
  hint: string;
  points: number;
  type?: "multiple_choice" | "fill_in" | "true_false" | "drag_drop";
  visualContext?: string;
}

export type ModuleType =
  | "warmup"
  | "explore"
  | "concept"
  | "adaptive_practice"
  | "detective_game"
  | "final_assessment"
  | "certificate"
  | "teacher_dashboard";

export type UserRole = "student" | "teacher";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar?: string;
  grade: string;
  school: string;
  role?: UserRole;
  xp: number;
  badges: Badge[];
  currentModule: ModuleType;
  completedModules: ModuleType[];
  gameScore: number;
  gameCompletedStages: number[];
  adaptiveStats: {
    totalAnswered: number;
    totalCorrect: number;
    currentDifficulty: DifficultyLevel;
    skillMistakes: Record<string, number>;
    skillSuccesses: Record<string, number>;
  };
  quizScore: number;
  quizTotal: number;
  passedFinal: boolean;
  certificateId?: string;
  completionDate?: string;
}
