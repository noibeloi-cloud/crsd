export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  birthDate: string;
  enrollDate: string;
  notes: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  date: string;
  term: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  notes: string;
}

export interface ClassInfo {
  name: string;
  section: string;
  teacher: string;
  schoolYear: string;
  room: string;
  schedule: string;
}

export type TabType = 'dashboard' | 'students' | 'grades' | 'attendance' | 'settings';
