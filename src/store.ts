import { Student, Grade, AttendanceRecord, ClassInfo } from './types';

const STORAGE_KEYS = {
  students: 'crs_students',
  grades: 'crs_grades',
  attendance: 'crs_attendance',
  classInfo: 'crs_classInfo',
};

// Sample data for initial load
const sampleStudents: Student[] = [
  { id: '1', firstName: 'Emma', lastName: 'Johnson', studentId: 'STU-001', email: 'emma.j@school.edu', gender: 'Female', birthDate: '2008-03-15', enrollDate: '2024-09-01', notes: '' },
  { id: '2', firstName: 'Liam', lastName: 'Smith', studentId: 'STU-002', email: 'liam.s@school.edu', gender: 'Male', birthDate: '2008-07-22', enrollDate: '2024-09-01', notes: '' },
  { id: '3', firstName: 'Olivia', lastName: 'Williams', studentId: 'STU-003', email: 'olivia.w@school.edu', gender: 'Female', birthDate: '2008-01-10', enrollDate: '2024-09-01', notes: 'Honor roll student' },
  { id: '4', firstName: 'Noah', lastName: 'Brown', studentId: 'STU-004', email: 'noah.b@school.edu', gender: 'Male', birthDate: '2008-11-05', enrollDate: '2024-09-01', notes: '' },
  { id: '5', firstName: 'Ava', lastName: 'Davis', studentId: 'STU-005', email: 'ava.d@school.edu', gender: 'Female', birthDate: '2008-05-18', enrollDate: '2024-09-01', notes: '' },
  { id: '6', firstName: 'James', lastName: 'Wilson', studentId: 'STU-006', email: 'james.w@school.edu', gender: 'Male', birthDate: '2008-09-30', enrollDate: '2024-09-01', notes: '' },
  { id: '7', firstName: 'Sophia', lastName: 'Martinez', studentId: 'STU-007', email: 'sophia.m@school.edu', gender: 'Female', birthDate: '2008-02-14', enrollDate: '2024-09-01', notes: 'Student council member' },
  { id: '8', firstName: 'Benjamin', lastName: 'Anderson', studentId: 'STU-008', email: 'ben.a@school.edu', gender: 'Male', birthDate: '2008-12-01', enrollDate: '2024-09-01', notes: '' },
];

const sampleGrades: Grade[] = [
  { id: '1', studentId: '1', subject: 'Mathematics', assignment: 'Midterm Exam', score: 92, maxScore: 100, date: '2025-01-15', term: '1st Semester' },
  { id: '2', studentId: '1', subject: 'Science', assignment: 'Lab Report', score: 88, maxScore: 100, date: '2025-01-20', term: '1st Semester' },
  { id: '3', studentId: '1', subject: 'English', assignment: 'Essay', score: 95, maxScore: 100, date: '2025-01-18', term: '1st Semester' },
  { id: '4', studentId: '2', subject: 'Mathematics', assignment: 'Midterm Exam', score: 78, maxScore: 100, date: '2025-01-15', term: '1st Semester' },
  { id: '5', studentId: '2', subject: 'Science', assignment: 'Lab Report', score: 85, maxScore: 100, date: '2025-01-20', term: '1st Semester' },
  { id: '6', studentId: '2', subject: 'English', assignment: 'Essay', score: 72, maxScore: 100, date: '2025-01-18', term: '1st Semester' },
  { id: '7', studentId: '3', subject: 'Mathematics', assignment: 'Midterm Exam', score: 96, maxScore: 100, date: '2025-01-15', term: '1st Semester' },
  { id: '8', studentId: '3', subject: 'Science', assignment: 'Lab Report', score: 94, maxScore: 100, date: '2025-01-20', term: '1st Semester' },
  { id: '9', studentId: '3', subject: 'English', assignment: 'Essay', score: 98, maxScore: 100, date: '2025-01-18', term: '1st Semester' },
  { id: '10', studentId: '4', subject: 'Mathematics', assignment: 'Midterm Exam', score: 65, maxScore: 100, date: '2025-01-15', term: '1st Semester' },
  { id: '11', studentId: '4', subject: 'Science', assignment: 'Lab Report', score: 70, maxScore: 100, date: '2025-01-20', term: '1st Semester' },
  { id: '12', studentId: '5', subject: 'Mathematics', assignment: 'Midterm Exam', score: 88, maxScore: 100, date: '2025-01-15', term: '1st Semester' },
  { id: '13', studentId: '5', subject: 'English', assignment: 'Essay', score: 91, maxScore: 100, date: '2025-01-18', term: '1st Semester' },
  { id: '14', studentId: '6', subject: 'Mathematics', assignment: 'Midterm Exam', score: 82, maxScore: 100, date: '2025-01-15', term: '1st Semester' },
  { id: '15', studentId: '7', subject: 'Science', assignment: 'Lab Report', score: 90, maxScore: 100, date: '2025-01-20', term: '1st Semester' },
  { id: '16', studentId: '8', subject: 'English', assignment: 'Essay', score: 76, maxScore: 100, date: '2025-01-18', term: '1st Semester' },
];

const sampleAttendance: AttendanceRecord[] = [
  { id: '1', studentId: '1', date: '2025-01-20', status: 'Present', notes: '' },
  { id: '2', studentId: '2', date: '2025-01-20', status: 'Present', notes: '' },
  { id: '3', studentId: '3', date: '2025-01-20', status: 'Late', notes: 'Arrived 10 min late' },
  { id: '4', studentId: '4', date: '2025-01-20', status: 'Absent', notes: 'Sick' },
  { id: '5', studentId: '5', date: '2025-01-20', status: 'Present', notes: '' },
  { id: '6', studentId: '6', date: '2025-01-20', status: 'Present', notes: '' },
  { id: '7', studentId: '7', date: '2025-01-20', status: 'Present', notes: '' },
  { id: '8', studentId: '8', date: '2025-01-20', status: 'Excused', notes: 'Family event' },
  { id: '9', studentId: '1', date: '2025-01-21', status: 'Present', notes: '' },
  { id: '10', studentId: '2', date: '2025-01-21', status: 'Absent', notes: '' },
  { id: '11', studentId: '3', date: '2025-01-21', status: 'Present', notes: '' },
  { id: '12', studentId: '4', date: '2025-01-21', status: 'Present', notes: '' },
  { id: '13', studentId: '5', date: '2025-01-21', status: 'Late', notes: '' },
  { id: '14', studentId: '6', date: '2025-01-21', status: 'Present', notes: '' },
  { id: '15', studentId: '7', date: '2025-01-21', status: 'Present', notes: '' },
  { id: '16', studentId: '8', date: '2025-01-21', status: 'Present', notes: '' },
];

const defaultClassInfo: ClassInfo = {
  name: 'Grade 10 - Section A',
  section: 'A',
  teacher: 'Mr. Robert Thompson',
  schoolYear: '2024-2025',
  room: 'Room 204',
  schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Error reading from storage:', e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to storage:', e);
  }
}

export function getStudents(): Student[] {
  return getFromStorage<Student[]>(STORAGE_KEYS.students, sampleStudents);
}

export function saveStudents(students: Student[]): void {
  saveToStorage(STORAGE_KEYS.students, students);
}

export function getGrades(): Grade[] {
  return getFromStorage<Grade[]>(STORAGE_KEYS.grades, sampleGrades);
}

export function saveGrades(grades: Grade[]): void {
  saveToStorage(STORAGE_KEYS.grades, grades);
}

export function getAttendance(): AttendanceRecord[] {
  return getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.attendance, sampleAttendance);
}

export function saveAttendance(attendance: AttendanceRecord[]): void {
  saveToStorage(STORAGE_KEYS.attendance, attendance);
}

export function getClassInfo(): ClassInfo {
  return getFromStorage<ClassInfo>(STORAGE_KEYS.classInfo, defaultClassInfo);
}

export function saveClassInfo(info: ClassInfo): void {
  saveToStorage(STORAGE_KEYS.classInfo, info);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
