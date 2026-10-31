import React, { useState } from 'react';
import { ClassInfo } from '../types';

interface SettingsProps {
  classInfo: ClassInfo;
  onSave: (info: ClassInfo) => void;
  onResetData: () => void;
}

export default function Settings({ classInfo, onSave, onResetData }: SettingsProps) {
  const [formData, setFormData] = useState<ClassInfo>(classInfo);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This will restore sample data and cannot be undone.')) {
      onResetData();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage class information and system settings</p>
      </div>

      {/* Class Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-school text-blue-500 mr-2"></i>
          Class Information
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <input
                type="text"
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Year</label>
              <input
                type="text"
                value={formData.schoolYear}
                onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
            {saved && (
              <span className="text-green-600 text-sm flex items-center gap-1">
                <i className="fas fa-check-circle"></i>
                Settings saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-database text-orange-500 mr-2"></i>
          Data Management
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          All data is stored locally in your browser. Clearing browser data will remove all records.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-undo"></i>
            Reset to Sample Data
          </button>
          <button
            onClick={() => {
              const data = {
                students: localStorage.getItem('crs_students'),
                grades: localStorage.getItem('crs_grades'),
                attendance: localStorage.getItem('crs_attendance'),
                classInfo: localStorage.getItem('crs_classInfo'),
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'class-record-backup.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-download"></i>
            Export Data
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-info-circle text-purple-500 mr-2"></i>
          About
        </h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Class Record System</strong> v1.0</p>
          <p>A comprehensive tool for managing student records, grades, and attendance.</p>
          <p className="text-gray-400 mt-4">Built with React, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
