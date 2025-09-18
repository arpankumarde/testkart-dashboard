export interface Exam {
  exam_id: number;
  exam: string;
  slug: string;
  category: string;
  status: number;
  default_pattern: DefaultPattern;
  created_at: string;
  updated_at: string;
}

export interface DefaultPattern {
  subjects: Subject[];
  positive_marks: number;
  negative_marks: number;
  exam_duration: number;
}

export interface Subject {
  subject_id: number;
  subject: string;
}
