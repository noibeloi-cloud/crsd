import React from 'react';
import { Student, Grade, AttendanceRecord, ClassInfo } from '../types';

interface DashboardProps {
  students: Student[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  classInfo: ClassInfo;
}

export default function Dashboard({ students, grades, attendance, classInfo }: DashboardProps) {
  const totalStudents = students.length;
  
  // Calculate class average
  const classAverage = grades.length > 0
    ? (grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length).toFixed(1)
    : '0';

  // Calculate attendance rate
  const todayStr = new Date().toISOString().split('T')[0];
  const recentAttendance = attendance.filter(a => a.date >= '2025-01-20');
  const presentCount = recentAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = recentAttendance.length > 0
    ? ((presentCount / recentAttendance.length) * 100).toFixed(1)
    : '0';

  // Get top performers
  const studentAverages = students.map(student => {
    const studentGrades = grades.filter(g => g.studentId === student.id);
    const avg = studentGrades.length > 0
      ? studentGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / studentGrades.length
      : 0;
    return { ...student, average: avg, gradeCount: studentGrades.length };
  }).filter(s => s.gradeCount > 0).sort((a, b) => b.average - a.average);

  // Subject averages
  const subjects = [...new Set(grades.map(g => g.subject))];
  const subjectAverages = subjects.map(subject => {
    const subjectGrades = grades.filter(g => g.subject === subject);
    const avg = subjectGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / subjectGrades.length;
    return { subject, average: avg, count: subjectGrades.length };
  });

  // Recent absences
  const absences = attendance.filter(a => a.status === 'Absent' || a.status === 'Late')
    .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Class Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{classInfo.name}</h2>
            <p className="text-blue-100 mt-1">Teacher: {classInfo.teacher}</p>
            <p className="text-blue-100">School Year: {classInfo.schoolYear}</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-blue-100">{classInfo.room}</p>
            <p className="text-blue-100">{classInfo.schedule}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-users text-blue-600 text-lg"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Class Average</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{classAverage}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-chart-line text-green-600 text-lg"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Attendance Rate</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{attendanceRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fas fa-clipboard-check text-purple-600 text-lg"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Grades</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{grades.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="fas fa-award text-orange-600 text-lg"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-trophy text-yellow-500 mr-2"></i>
            Top Performers
          </h3>
          {studentAverages.length > 0 ? (
            <div className="space-y-3">
              {studentAverages.slice(0, 5).map((student: typeof studentAverages[0], idx: number) => (
                <div key={student.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                      idx === 1 ? 'bg-gray-100 text-gray-700' :
                      idx === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-gray-500">{student.gradeCount} grades recorded</p>
                    </div>
                  </div>
                  <span className={`font-bold text-lg ${
                    student.average >= 90 ? 'text-green-600' :
                    student.average >= 80 ? 'text-blue-600' :
                    student.average >= 70 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {student.average.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No grades recorded yet</p>
          )}
        </div>

        {/* Subject Averages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-book text-indigo-500 mr-2"></i>
            Subject Averages
          </h3>
          {subjectAverages.length > 0 ? (
            <div className="space-y-4">
              {subjectAverages.map((subj) => (
                <div key={subj.subject}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{subj.subject}</span>
                    <span className="text-sm font-bold text-gray-800">{subj.average.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        subj.average >= 90 ? 'bg-green-500' :
                        subj.average >= 80 ? 'bg-blue-500' :
                        subj.average >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${subj.average}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No grades recorded yet</p>
          )}
        </div>
      </div>

      {/* Recent Absences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-exclamation-triangle text-red-500 mr-2"></i>
          Recent Absences & Tardiness
        </h3>
        {absences.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Student</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {absences.map(record => {
                  const student = students.find(s => s.id === record.studentId);
                  return (
                    <tr key={record.id} className="border-b border-gray-50">
                      <td className="py-2 px-3 font-medium text-gray-800">
                        {student ? `${student.firstName} ${student.lastName}` : 'Unknown'}
                      </td>
                      <td className="py-2 px-3 text-gray-600">{record.date}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-500">{record.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No recent absences</p>
        )}
      </div>
    </div>
  );
}
