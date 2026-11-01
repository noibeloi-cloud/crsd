import React, { useState } from 'react';
import { Student } from '../types';
import { generateId } from '../store';

interface StudentsProps {
  students: Student[];
  onSave: (students: Student[]) => void;
}

export default function Students({ students, onSave }: StudentsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Student>>({
    firstName: '', lastName: '', studentId: '', email: '', gender: 'Male', birthDate: '', enrollDate: '', notes: ''
  });

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.studentId}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      const updated = students.map(s => s.id === editingStudent.id ? { ...s, ...formData } as Student : s);
      onSave(updated);
    } else {
      const newStudent: Student = {
        id: generateId(),
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        studentId: formData.studentId || `STU-${String(students.length + 1).padStart(3, '0')}`,
        email: formData.email || '',
        gender: (formData.gender as 'Male' | 'Female' | 'Other') || 'Male',
        birthDate: formData.birthDate || '',
        enrollDate: formData.enrollDate || new Date().toISOString().split('T')[0],
        notes: formData.notes || '',
      };
      onSave([...students, newStudent]);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingStudent(null);
    setFormData({ firstName: '', lastName: '', studentId: '', email: '', gender: 'Male', birthDate: '', enrollDate: '', notes: '' });
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      onSave(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Students</h2>
          <p className="text-gray-500 text-sm mt-1">{students.length} students enrolled</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <i className="fas fa-plus"></i>
          Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          placeholder="Search by name or student ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName || ''}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName || ''}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input
                      type="text"
                      value={formData.studentId || ''}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender || 'Male'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                    <input
                      type="date"
                      value={formData.birthDate || ''}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                    <input
                      type="date"
                      value={formData.enrollDate || ''}
                      onChange={(e) => setFormData({ ...formData, enrollDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                  >
                    {editingStudent ? 'Update Student' : 'Add Student'}
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

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Student ID</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden lg:table-cell">Gender</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold hidden lg:table-cell">Enrolled</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">{student.studentId}</td>
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
                          {student.notes && <p className="text-xs text-gray-400 truncate max-w-[150px]">{student.notes}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{student.email}</td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.gender === 'Female' ? 'bg-pink-50 text-pink-600' :
                        student.gender === 'Male' ? 'bg-blue-50 text-blue-600' :
                        'bg-purple-50 text-purple-600'
                      }`}>
                        {student.gender}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">{student.enrollDate}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <i className="fas fa-user-slash text-3xl mb-3 block"></i>
                    {searchTerm ? 'No students match your search' : 'No students added yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
