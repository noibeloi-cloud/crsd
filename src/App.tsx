import React, { useState, useEffect } from 'react';
import { Student, Grade, AttendanceRecord, ClassInfo, TabType } from './types';
import { getStudents, saveStudents, getGrades, saveGrades, getAttendance, saveAttendance, getClassInfo, saveClassInfo } from './store';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Grades from './components/Grades';
import Attendance from './components/Attendance';
import Settings from './components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [classInfo, setClassInfo] = useState<ClassInfo>({
    name: '', section: '', teacher: '', schoolYear: '', room: '', schedule: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setStudents(getStudents());
    setGrades(getGrades());
    setAttendance(getAttendance());
    setClassInfo(getClassInfo());
  }, []);

  const handleSaveStudents = (updated: Student[]) => {
    setStudents(updated);
    saveStudents(updated);
  };

  const handleSaveGrades = (updated: Grade[]) => {
    setGrades(updated);
    saveGrades(updated);
  };

  const handleSaveAttendance = (updated: AttendanceRecord[]) => {
    setAttendance(updated);
    saveAttendance(updated);
  };

  const handleSaveClassInfo = (updated: ClassInfo) => {
    setClassInfo(updated);
    saveClassInfo(updated);
  };

  const handleResetData = () => {
    localStorage.clear();
    setStudents(getStudents());
    setGrades(getGrades());
    setAttendance(getAttendance());
    setClassInfo(getClassInfo());
  };

  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
    { id: 'students', label: 'Students', icon: 'fas fa-users' },
    { id: 'grades', label: 'Grades', icon: 'fas fa-graduation-cap' },
    { id: 'attendance', label: 'Attendance', icon: 'fas fa-clipboard-list' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-sm transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-book-open text-white text-lg"></i>
              </div>
              <div>
                <h1 className="font-bold text-gray-800 text-lg leading-tight">Class Record</h1>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <i className={`${item.icon} w-5 text-center ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`}></i>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-800">{classInfo.name || 'Class Record System'}</p>
              <p className="text-xs text-blue-600 mt-0.5">{classInfo.teacher || 'Set up in Settings'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-800 p-1"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {activeTab === 'dashboard' ? '📊 Dashboard' :
               activeTab === 'students' ? '👥 Students' :
               activeTab === 'grades' ? '📝 Grades' :
               activeTab === 'attendance' ? '📋 Attendance' :
               '⚙️ Settings'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <i className="fas fa-calendar"></i>
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              students={students}
              grades={grades}
              attendance={attendance}
              classInfo={classInfo}
            />
          )}
          {activeTab === 'students' && (
            <Students students={students} onSave={handleSaveStudents} />
          )}
          {activeTab === 'grades' && (
            <Grades grades={grades} students={students} onSave={handleSaveGrades} />
          )}
          {activeTab === 'attendance' && (
            <Attendance attendance={attendance} students={students} onSave={handleSaveAttendance} />
          )}
          {activeTab === 'settings' && (
            <Settings classInfo={classInfo} onSave={handleSaveClassInfo} onResetData={handleResetData} />
          )}
        </div>
      </main>
    </div>
  );
}
