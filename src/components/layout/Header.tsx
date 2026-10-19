import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import {
  Menu,
  Bell,
  Calendar,
  RotateCcw,
  Sparkles,
  ChevronDown,
  User as UserIcon,
  LogOut,
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

interface HeaderProps {
  currentView: string;
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onOpenMobileSidebar }) => {
  const { currentUser, currentRole, currentStudentProfile, currentFacultyProfile, switchUser, availableUsers, logout } =
    useAuth();
  const { notifications, resetToDefaultData } = useERP();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userNotifications = notifications.filter(
    (n) => n.recipientUserId === currentUser?.id || n.recipientUserId === 'usr-all'
  );
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const getViewTitle = (view: string) => {
    const titles: Record<string, string> = {
      'admin-dashboard': 'Institutional Overview & Analytics',
      'admin-enrollment': 'Student Enrolment & Admissions Registry',
      'admin-accounts': 'Student & Faculty Account Management',
      'admin-attendance': 'Attendance Correction & Escalations Desk',
      'admin-exams': 'Examination & Result Publication Engine',
      'admin-timetable': 'Timetable & Classroom Conflict Manager',
      'admin-complaints': 'Grievance Redressal & Priority Desk',
      'admin-settings': 'Academic Regulations & Risk Thresholds',
      'admin-audit': 'Immutable Security Audit Logs',

      'faculty-dashboard': 'Faculty Teaching & Attendance Hub',
      'faculty-attendance': 'Daily Attendance Register',
      'faculty-corrections': '7-Day Attendance Correction Queue',
      'faculty-marks': 'Continuous & Final Marks Entry',
      'faculty-timetable': 'Weekly Teaching & Invigilation Schedule',
      'faculty-complaints': 'Assigned Grievances & Work Orders',

      'student-dashboard': 'Student Academic Dashboard',
      'student-attendance': 'Attendance Record & Risk Analysis',
      'student-results': 'Examination Results & Official Transcript',
      'student-timetable': 'Weekly Class Timetable & Exam Dates',
      'student-analytics': 'Performance Analytics & Semester Trends',
      'student-complaints': 'File Grievance & Live Status Timeline',
      'student-profile': 'Student Bio & Contact Details',
    };
    return titles[view] || 'Academic Management System';
  };

  const getDisplayName = () => {
    if (currentRole === 'ADMIN') return 'Registrar Admin';
    if (currentRole === 'FACULTY') return currentFacultyProfile?.fullName || 'Faculty Member';
    return currentStudentProfile?.fullName || 'Student User';
  };

  const getAvatar = () => {
    if (currentRole === 'FACULTY' && currentFacultyProfile?.avatarUrl) return currentFacultyProfile.avatarUrl;
    if (currentRole === 'STUDENT' && currentStudentProfile?.avatarUrl) return currentStudentProfile.avatarUrl;
    return null;
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Zone: Mobile toggle + Breadcrumb Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Smart Campus ERP</span>
              <span>/</span>
              <span className="text-slate-600 font-semibold truncate capitalize">{currentRole.toLowerCase()}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
              {getViewTitle(currentView)}
            </h1>
          </div>
        </div>

        {/* Right Zone: Academic Session + Notification + User Pill */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Academic Session Marker */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono">AY 2025–26</span>
            <span>·</span>
            <span>Odd Sem</span>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo state to fresh default mock data?')) {
                resetToDefaultData();
              }
            }}
            title="Reset Mock State"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 sm:pr-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              {getAvatar() ? (
                <img
                  src={getAvatar()!}
                  alt={getDisplayName()}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                  {getDisplayName().charAt(0)}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                  {getDisplayName()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono capitalize">{currentRole.toLowerCase()}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Switch User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Active Demo Account
                </div>
                <div className="py-1 max-h-60 overflow-y-auto">
                  {availableUsers.map((u) => {
                    const isSelected = u.id === currentUser?.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-indigo-50 text-indigo-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{u.loginId}</div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {u.role}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1.5 mt-1 border-t border-slate-100 px-2">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                  >
                    <span>Sign Out to Login</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Persistent Notification Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
