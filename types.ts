
export interface Lesson {
  id: string;
  title: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  duration: string;
  image: string;
  description: string;
}

export interface ExamModule {
  id: string;
  name: string;
  duration: string;
  questions: number;
}

export interface Exam {
  id: string;
  name: string;
  type: 'IELTS' | 'TOEFL' | 'Duolingo' | 'PTE';
  image: string;
  description: string;
  modules: ExamModule[];
}

export interface UserStats {
  streak: number;
  xp: number;
  level: number;
  completedLessons: string[];
  examReadiness: number; // 0-100 percentage
}

export type View = 'dashboard' | 'tutor' | 'lessons' | 'exams' | 'profile';
