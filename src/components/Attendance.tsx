import React, { useState } from 'react';
import { AttendanceRecord, Student } from '../types';
import { generateId } from '../store';

interface AttendanceProps {
  attendance: AttendanceRecord[];
  students: Student[];
  onSave: (attendance: AttendanceRecord[]) => void;
}

export default function Attendance({ attendance, students, onSave }: AttendanceProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'daily' | 'summary'>('daily');

  // Get attendance for selected date
  const dayRecords = attendance.filter(a => a.date === selectedDate);

  const getStatus = (studentId: string): string => {
    const record = dayRecords.find(r => r.studentId === studentId);
    return record?.status || 'Not Recorded';
  };

  const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
    const existing = attendance.find(a => a.studentId === studentId && a.date === selectedDate);
    if (existing) {
      const updated = attendance.map(a =>
        a.id === existing.id ? { ...a, status } : a
      );
      onSave(updated);
    } else {
      const newRecord: AttendanceRecord = {
        id: generateId(),
        studentId,
        date: selectedDate,
        status,
        notes: '',
      };
      onSave([...attendance, newRecord]);
    }
  };

  const markAllPresent = () => {
    let updated = [...attendance];
    students.forEach(student => {
      const existing = updated.find(a => a.studentId === student.id && a.date === selectedDate);
      if (existing) {
        updated = updated.map(a => a.id === existing.id ? { ...a, status: 'Present' as const } : a);
      } else {
        updated.push({
          id: generateId(),
          studentId: student.id,
          date: selectedDate,
          status: 'Present',
          notes: '',
        });
      }
    });
    onSave(updated);
  };

  // Summary statistics
  const getStudentSummary = (studentId: string) => {
    const records = attendance.filter(a => a.studentId === studentId);
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const late = records.filter(r => r.status === 'Late').length;
    const excused = records.filter(r => r.status === 'Excused').length;
    const rate = total > 0 ? ((present + late) / total) * 100 : 0;
    return { total, present, absent, late, excused, rate };
  };

  // Daily stats
  const presentToday = dayRecords.filter(r => r.status === 'Present').length;
  const absentToday = dayRecords.filter(r => r.status === 'Absent').length;
  const lateToday = dayRecords.filter(r => r.status === 'Late').length;
  const excusedToday = dayRecords.filter(r => r.status === 'Excused').length;
  const notRecordedToday = students.length - dayRecords.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
          <p className="text-gray-500 text-sm mt-1">Track daily student attendance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              viewMode === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-calendar-day mr-2"></i>Daily
          </button>
          <button
            onClick={() => setViewMode('summary')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              viewMode === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-chart-bar mr-2"></i>Summary
          </button>
        </div>
      </div>

      {viewMode === 'daily' ? (
        <>
          {/* Date Picker & Actions */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <button
              onClick={markAllPresent}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <i className="fas fa-check-double"></i>
              Mark All Present
            </button>
          </div>

          {/* Daily Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{presentToday}</p>
              <p className="text-xs text-green-600 font-medium">Present</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{absentToday}</p>
              <p className="text-xs text-red-600 font-medium">Absent</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-600">{lateToday}</p>
              <p className="text-xs text-yellow-600 font-medium">Late</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{excusedToday}</p>
              <p className="text-xs text-blue-600 font-medium">Excused</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-600">{notRecordedToday}</p>
              <p className="text-xs text-gray-600 font-medium">Not Recorded</p>
            </div>
          </div>

          {/* Attendance List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">#</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Student</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => {
                    const currentStatus = getStatus(student.id);
                    return (
                      <tr key={student.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 text-gray-400 font-medium">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                              student.gender === 'Female' ? 'bg-pink-100 text-pink-600' :
                              student.gender === 'Male' ? 'bg-blue-100 text-blue-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {student.firstName[0]}{student.lastName[0]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{student.firstName} {student.lastName}</p>
                              <p className="text-xs text-gray-400">{student.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 flex-wrap">
                            {(['Present', 'Absent', 'Late', 'Excused'] as const).map(status => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(student.id, status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  currentStatus === status
                                    ? status === 'Present' ? 'bg-green-600 text-white shadow-sm' :
                                      status === 'Absent' ? 'bg-red-600 text-white shadow-sm' :
                                      status === 'Late' ? 'bg-yellow-500 text-white shadow-sm' :
                                      'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Summary View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">#</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Student</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Total Days</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Present</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Absent</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Late</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Excused</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Rate</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const summary = getStudentSummary(student.id);
                  return (
                    <tr key={student.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 text-gray-400 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{student.firstName} {student.lastName}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{summary.total}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-green-600 font-medium">{summary.present}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-red-600 font-medium">{summary.absent}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-yellow-600 font-medium">{summary.late}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-blue-600 font-medium">{summary.excused}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                summary.rate >= 90 ? 'bg-green-500' :
                                summary.rate >= 75 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${summary.rate}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-bold ${
                            summary.rate >= 90 ? 'text-green-600' :
                            summary.rate >= 75 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {summary.rate.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
