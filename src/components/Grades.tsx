import React, { useState } from 'react';
import { Grade, Student } from '../types';
import { generateId } from '../store';

interface GradesProps {
  grades: Grade[];
  students: Student[];
  onSave: (grades: Grade[]) => void;
}

export default function Grades({ grades, students, onSave }: GradesProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [filterStudent, setFilterStudent] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [formData, setFormData] = useState<Partial<Grade>>({
    studentId: '', subject: '', assignment: '', score: 0, maxScore: 100, date: '', term: '1st Semester'
  });

  const subjects = [...new Set(grades.map(g => g.subject))];
  const terms = [...new Set(grades.map(g => g.term))];

  const filteredGrades = grades.filter(g => {
    const matchStudent = !filterStudent || g.studentId === filterStudent;
    const matchSubject = !filterSubject || g.subject === filterSubject;
    return matchStudent && matchSubject;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getGradeColor = (score: number, maxScore: number) => {
    const pct = (score / maxScore) * 100;
    if (pct >= 90) return 'text-green-600 bg-green-50';
    if (pct >= 80) return 'text-blue-600 bg-blue-50';
    if (pct >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGrade) {
      const updated = grades.map(g => g.id === editingGrade.id ? { ...g, ...formData } as Grade : g);
      onSave(updated);
    } else {
      const newGrade: Grade = {
        id: generateId(),
        studentId: formData.studentId || '',
        subject: formData.subject || '',
        assignment: formData.assignment || '',
        score: Number(formData.score) || 0,
        maxScore: Number(formData.maxScore) || 100,
        date: formData.date || new Date().toISOString().split('T')[0],
        term: formData.term || '1st Semester',
      };
      onSave([...grades, newGrade]);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingGrade(null);
    setFormData({ studentId: '', subject: '', assignment: '', score: 0, maxScore: 100, date: '', term: '1st Semester' });
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setFormData(grade);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this grade?')) {
      onSave(grades.filter(g => g.id !== id));
    }
  };

  // Calculate student report card
  const studentReports = students.map(student => {
    const studentGrades = grades.filter(g => g.studentId === student.id);
    const avg = studentGrades.length > 0
      ? studentGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / studentGrades.length
      : 0;
    return { ...student, average: avg, gradeCount: studentGrades.length };
  }).sort((a, b) => b.average - a.average);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Grades</h2>
          <p className="text-gray-500 text-sm mt-1">{grades.length} grades recorded</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <i className="fas fa-plus"></i>
          Add Grade
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={filterStudent}
          onChange={(e) => setFilterStudent(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
          <option value="">All Students</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
          ))}
        </select>
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
          <option value="">All Subjects</option>
          {subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingGrade ? 'Edit Grade' : 'Add New Grade'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                  <select
                    required
                    value={formData.studentId || ''}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentId})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject || ''}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                    <select
                      value={formData.term || '1st Semester'}
                      onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="1st Semester">1st Semester</option>
                      <option value="2nd Semester">2nd Semester</option>
                      <option value="Summer">Summer</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment *</label>
                  <input
                    type="text"
                    required
                    value={formData.assignment || ''}
                    onChange={(e) => setFormData({ ...formData, assignment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Midterm Exam, Quiz 1"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Score *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.score || ''}
                      onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxScore || 100}
                      onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                  >
                    {editingGrade ? 'Update Grade' : 'Add Grade'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Grades Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Student</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Subject</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden md:table-cell">Assignment</th>
                <th className="text-center py-3 px-4 text-gray-600 font-semibold">Score</th>
                <th className="text-center py-3 px-4 text-gray-600 font-semibold hidden md:table-cell">Percentage</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden lg:table-cell">Date</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade) => {
                  const pct = ((grade.score / grade.maxScore) * 100).toFixed(1);
                  return (
                    <tr key={grade.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-800">{getStudentName(grade.studentId)}</td>
                      <td className="py-3 px-4 text-gray-600">{grade.subject}</td>
                      <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{grade.assignment}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${getGradeColor(grade.score, grade.maxScore)}`}>
                          {grade.score}/{grade.maxScore}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center hidden md:table-cell">
                        <span className="font-medium text-gray-700">{pct}%</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">{grade.date}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleEdit(grade)}
                          className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(grade.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <i className="fas fa-clipboard text-3xl mb-3 block"></i>
                    No grades found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Report Card Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-file-alt text-indigo-500 mr-2"></i>
          Student Report Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Rank</th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Student</th>
                <th className="text-center py-2 px-3 text-gray-500 font-medium">Grades</th>
                <th className="text-center py-2 px-3 text-gray-500 font-medium">Average</th>
                <th className="text-center py-2 px-3 text-gray-500 font-medium">Standing</th>
              </tr>
            </thead>
            <tbody>
              {studentReports.filter(s => s.gradeCount > 0).map((student, idx) => (
                <tr key={student.id} className="border-b border-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-600">#{idx + 1}</td>
                  <td className="py-2 px-3 font-medium text-gray-800">{student.firstName} {student.lastName}</td>
                  <td className="py-2 px-3 text-center text-gray-600">{student.gradeCount}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`font-bold ${
                      student.average >= 90 ? 'text-green-600' :
                      student.average >= 80 ? 'text-blue-600' :
                      student.average >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {student.average.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.average >= 90 ? 'bg-green-100 text-green-700' :
                      student.average >= 80 ? 'bg-blue-100 text-blue-700' :
                      student.average >= 70 ? 'bg-yellow-100 text-yellow-700' :
                      student.average >= 60 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {student.average >= 90 ? 'Excellent' :
                       student.average >= 80 ? 'Very Good' :
                       student.average >= 70 ? 'Good' :
                       student.average >= 60 ? 'Fair' :
                       'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
