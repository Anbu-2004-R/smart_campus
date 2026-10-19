import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  GraduationCap,
  CalendarDays,
  LifeBuoy,
  Settings,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Clock,
  TrendingUp,
  UserCircle,
  LogOut,
  Sparkles,
  School,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (viewId: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { currentUser, currentRole, currentStudentProfile, currentFacultyProfile, logout, switchUser, availableUsers } =
    useAuth();
  const { correctionRequests, complaints, exams, admissionApplications } = useERP();

  // Compute pending badges
  const pendingFacultyCorrections = correctionRequests.filter((r) => r.status === 'PENDING_FACULTY').length;
  const pendingAdminCorrections = correctionRequests.filter((r) => r.status === 'PENDING_ADMIN').length;
  const openComplaints = complaints.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length;
  const unPublishedExams = exams.filter((e) => e.status === 'READY_TO_PUBLISH' || e.status === 'MARKS_PENDING').length;
  const pendingApplications = admissionApplications.filter(
    (a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW'
  ).length;

  const adminNav: NavItem[] = [
    { id: 'admin-dashboard', label: 'Campus Overview', icon: LayoutDashboard },
    {
      id: 'admin-enrollment',
      label: 'Student Enrolment',
      icon: UserCheck,
      badge: pendingApplications > 0 ? pendingApplications : undefined,
    },
    { id: 'admin-accounts', label: 'User Accounts', icon: Users },
    {
      id: 'admin-attendance',
      label: 'Attendance Approvals',
      icon: CalendarCheck,
      badge: pendingAdminCorrections > 0 ? pendingAdminCorrections : undefined,
    },
    {
      id: 'admin-exams',
      label: 'Exam & Results',
      icon: GraduationCap,
      badge: unPublishedExams > 0 ? unPublishedExams : undefined,
    },
    { id: 'admin-timetable', label: 'Timetable Manager', icon: CalendarDays },
    {
      id: 'admin-complaints',
      label: 'Complaint Desk',
      icon: LifeBuoy,
      badge: openComplaints > 0 ? openComplaints : undefined,
    },
    { id: 'admin-settings', label: 'Academic Settings', icon: Settings },
    { id: 'admin-audit', label: 'Audit Trail', icon: ShieldCheck },
  ];

  const facultyNav: NavItem[] = [
    { id: 'faculty-dashboard', label: 'Faculty Desk', icon: LayoutDashboard },
    { id: 'faculty-attendance', label: 'Attendance Register', icon: CalendarCheck },
    {
      id: 'faculty-corrections',
      label: '7-Day Corrections',
      icon: CheckCircle2,
      badge: pendingFacultyCorrections > 0 ? pendingFacultyCorrections : undefined,
    },
    { id: 'faculty-marks', label: 'Marks Entry', icon: FileSpreadsheet },
    { id: 'faculty-timetable', label: 'Teaching Schedule', icon: Clock },
    { id: 'faculty-complaints', label: 'Assigned Complaints', icon: LifeBuoy },
  ];

  const studentNav: NavItem[] = [
    { id: 'student-dashboard', label: 'Student Home', icon: LayoutDashboard },
    { id: 'student-attendance', label: 'Attendance & Risk', icon: CalendarCheck },
    { id: 'student-results', label: 'Results & Transcript', icon: GraduationCap },
    { id: 'student-timetable', label: 'Class Schedule', icon: CalendarDays },
    { id: 'student-analytics', label: 'Academic Analytics', icon: TrendingUp },
    { id: 'student-complaints', label: 'Grievance Tracking', icon: LifeBuoy },
    { id: 'student-profile', label: 'Student Profile', icon: UserCircle },
  ];

  const navItems =
    currentRole === 'ADMIN' ? adminNav : currentRole === 'FACULTY' ? facultyNav : studentNav;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Zone */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <School className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white whitespace-nowrap">
              Smart Campus ERP
            </div>
            <div className="text-[11px] text-slate-400 font-mono tracking-tight">Academic Portal</div>
          </div>
        </div>

        {/* Current Active Role Indicator */}
        <div className="px-4 py-3 mx-4 my-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Session Role</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold tracking-wide ${
                currentRole === 'ADMIN'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : currentRole === 'FACULTY'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {currentRole}
            </span>
          </div>
          <div className="text-xs font-semibold text-white truncate">
            {currentRole === 'ADMIN'
              ? 'Administrator Office'
              : currentRole === 'FACULTY'
              ? currentFacultyProfile?.fullName || 'Faculty Member'
              : currentStudentProfile?.fullName || 'Student'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate">
            {currentRole === 'ADMIN'
              ? 'Institutional Root'
              : currentRole === 'FACULTY'
              ? currentFacultyProfile?.employeeId
              : currentStudentProfile?.registerNumber}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Role Switcher for Demo testing */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center justify-between">
            <span>Quick Role Switch</span>
            <span className="text-[10px] text-slate-400 font-mono">Demo Mode</span>
          </div>
          <div className="grid grid-cols-3 gap-1 mb-3">
            <button
              onClick={() => switchUser('usr-admin-1')}
              className={`py-1 text-[11px] font-medium rounded transition-colors ${
                currentRole === 'ADMIN'
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => switchUser('usr-fac-1')}
              className={`py-1 text-[11px] font-medium rounded transition-colors ${
                currentRole === 'FACULTY'
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Faculty
            </button>
            <button
              onClick={() => switchUser('usr-stu-1')}
              className={`py-1 text-[11px] font-medium rounded transition-colors ${
                currentRole === 'STUDENT'
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Student
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-800 text-slate-400">
            <span className="truncate max-w-[120px]">{currentUser?.email}</span>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-rose-400 transition-colors p-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
