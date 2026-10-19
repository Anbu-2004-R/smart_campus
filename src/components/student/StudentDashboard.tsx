import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import {
  GraduationCap,
  CalendarCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  BookOpen,
  LifeBuoy,
  FileText,
  Bell,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  History,
  ShieldCheck,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (viewId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { currentStudentProfile } = useAuth();
  const {
    calculateStudentAttendance,
    semesterResults,
    timetable,
    announcements,
    subjects,
    classrooms,
    facultyProfiles,
    enrollments,
    complaints,
    exams,
  } = useERP();

  const studentId = currentStudentProfile?.id || 'stu-1';
  const attendanceSummary = calculateStudentAttendance(studentId);

  // Active Enrollment Record (Section 7.2)
  const myEnrollments = enrollments.filter((e) => e.studentId === studentId);
  const activeEnrollment = myEnrollments.find((e) => e.status === 'ACTIVE') || myEnrollments[0];

  // Latest semester result
  const myResults = semesterResults.filter((r) => r.studentId === studentId);
  const latestResult = myResults[myResults.length - 1];

  // Today's classes (Monday schedule for class group)
  const myGroupClasses = timetable.filter(
    (t) => t.classGroupId === currentStudentProfile?.classGroupId && t.dayOfWeek === 'MONDAY'
  );

  // Student grievances
  const myComplaints = complaints.filter(
    (c) => c.submitterName === currentStudentProfile?.fullName || c.submittedByUserId === currentStudentProfile?.userId
  );

  const urgentAnnouncements = announcements.filter((a) => a.priority === 'URGENT');

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Student Profile & Academic Enrolment Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {currentStudentProfile?.avatarUrl ? (
            <img
              src={currentStudentProfile.avatarUrl}
              alt={currentStudentProfile.fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 shrink-0 shadow-2xs"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center shrink-0">
              {currentStudentProfile?.fullName.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 font-mono">
                {currentStudentProfile?.registerNumber}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono">
                AY {activeEnrollment?.academicYear || '2025–2026'} · Semester {currentStudentProfile?.currentSemester}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                {activeEnrollment?.status || 'ACTIVE'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {currentStudentProfile?.fullName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              B.Tech in Computer Science &amp; Engineering · Section: <strong className="text-slate-800 font-mono">{activeEnrollment?.classGroupName || 'CSE-5A'}</strong> ({activeEnrollment?.creditsRegistered || 18} Registered Credits)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Enrolment History</span>
          </button>
          <button
            onClick={() => onNavigate('student-attendance')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-2"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Attendance Log</span>
          </button>
          <button
            onClick={() => onNavigate('student-results')}
            className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-2"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Transcript</span>
          </button>
        </div>
      </div>

      {/* Urgent Campus Notice if any */}
      {urgentAnnouncements.length > 0 && (
        <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold block mb-0.5">{urgentAnnouncements[0].title}</strong>
            <p className="text-amber-800 leading-relaxed">{urgentAnnouncements[0].content}</p>
          </div>
        </div>
      )}

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Overall Attendance"
          value={`${attendanceSummary.overallPercentage}%`}
          subValue={`${attendanceSummary.attendedClasses} / ${attendanceSummary.totalClasses} Classes`}
          trend={{
            value: attendanceSummary.overallPercentage >= 75 ? 'Exam Eligible' : 'Ineligible Alert',
            isPositive: attendanceSummary.overallPercentage >= 75,
          }}
          icon={CalendarCheck}
          accentColor={attendanceSummary.overallPercentage >= 75 ? 'emerald' : 'rose'}
          onClick={() => onNavigate('student-attendance')}
        />
        <StatCard
          label="Attendance Risk Standing"
          value={attendanceSummary.riskLevel}
          subValue={
            attendanceSummary.riskLevel === 'LOW'
              ? 'Safe Standing'
              : attendanceSummary.riskLevel === 'MEDIUM'
              ? 'Approaching Cutoff'
              : 'Immediate Action Required'
          }
          trend={{
            value: `${attendanceSummary.recentAbsenceCount} recent absence(s)`,
            isNeutral: true,
          }}
          icon={AlertTriangle}
          accentColor={
            attendanceSummary.riskLevel === 'LOW'
              ? 'emerald'
              : attendanceSummary.riskLevel === 'MEDIUM'
              ? 'amber'
              : 'rose'
          }
          onClick={() => onNavigate('student-attendance')}
        />
        <StatCard
          label="Cumulative CGPA"
          value={latestResult ? latestResult.overallCGPA.toFixed(2) : '9.42'}
          subValue={`Sem ${(currentStudentProfile?.currentSemester || 5) - 1} GPA: ${latestResult ? latestResult.semesterGPA.toFixed(2) : '9.50'}`}
          trend={{ value: 'First Class Distinction', isPositive: true }}
          icon={GraduationCap}
          accentColor="indigo"
          onClick={() => onNavigate('student-results')}
        />
        <StatCard
          label="Classes Today (Mon)"
          value={myGroupClasses.length}
          subValue="Section CSE-5A Lectures"
          icon={Clock}
          accentColor="slate"
          onClick={() => onNavigate('student-timetable')}
        />
      </div>

      {/* Upcoming End Semester Examination Schedule Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
                Examination Schedule
              </span>
              <span className="text-slate-300">·</span>
              <h3 className="text-sm font-bold text-slate-900">Autumn 2025 End Semester Examinations</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved timetable released by the Controller of Examinations. Hall tickets issued to students with &ge; 75.0% attendance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded text-xs font-semibold font-mono ${
                attendanceSummary.overallPercentage >= 75
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {attendanceSummary.overallPercentage >= 75 ? 'Hall Ticket Cleared' : 'Attendance Debarment Alert'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-indigo-700">CS501 · Operating Systems</div>
              <div className="font-semibold text-slate-900 text-xs mt-1">Wednesday, Nov 12, 2025</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">09:30 AM – 12:30 PM (3 Hours)</div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 font-mono">
              <span>Venue: <strong>LH-101</strong></span>
              <span className="text-slate-400">Max: 100</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-indigo-700">CS502 · Database Systems</div>
              <div className="font-semibold text-slate-900 text-xs mt-1">Saturday, Nov 15, 2025</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">09:30 AM – 12:30 PM (3 Hours)</div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 font-mono">
              <span>Venue: <strong>LH-101</strong></span>
              <span className="text-slate-400">Max: 100</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-indigo-700">CS503 · Computer Networks</div>
              <div className="font-semibold text-slate-900 text-xs mt-1">Tuesday, Nov 18, 2025</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">09:30 AM – 12:30 PM (3 Hours)</div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 font-mono">
              <span>Venue: <strong>LH-102</strong></span>
              <span className="text-slate-400">Max: 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Subject Attendance & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Attendance Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Current Semester Attendance Breakdown</h3>
              <p className="text-xs text-slate-500">Official subject-wise attendance for Semester 5</p>
            </div>
            <button
              onClick={() => onNavigate('student-attendance')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Detailed History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {attendanceSummary.subjectWise.map((sub) => (
              <div
                key={sub.subjectId}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{sub.subjectCode}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-medium text-slate-800">{sub.subjectName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Attended: <strong>{sub.attended}</strong> / {sub.total} sessions
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-28 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sub.percentage >= 80 ? 'bg-emerald-500' : sub.percentage >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-900 w-12 text-right">
                    {sub.percentage}%
                  </span>
                  <StatusBadge status={sub.riskLevel} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Grievance Tracker */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Campus Services &amp; Actions</h3>
            <p className="text-xs text-slate-500 mb-4">Quick portal shortcuts</p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('student-attendance')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-900">Request Attendance Correction</div>
                  <div className="text-[11px] text-slate-500">Apply within 7 days of class session (D-1)</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('student-results')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-900">Download Official Transcript</div>
                  <div className="text-[11px] text-slate-500">Verified institutional result sheet</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('student-complaints')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-900">Submit Campus Grievance</div>
                  <div className="text-[11px] text-slate-500">Track resolution timeline in real-time</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Recent Grievance Status snippet if any */}
            {myComplaints.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Active Grievance Tracker
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-slate-700">{myComplaints[0].ticketNumber}</span>
                  <StatusBadge status={myComplaints[0].status} />
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{myComplaints[0].title}</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Autumn Term · Section 4.3</span>
            <span className="font-mono text-indigo-600 font-semibold">Active Session</span>
          </div>
        </div>
      </div>

      {/* Enrolment Progression History Modal */}
      {isHistoryModalOpen && (
        <Modal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          title="Student Academic Enrolment & Progression History"
          subtitle={`Register Number: ${currentStudentProfile?.registerNumber} · Section 7.2 student_enrollments`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-semibold text-slate-900">{currentStudentProfile?.fullName}</div>
              <div className="text-[11px] text-slate-500 font-mono">
                Department: Computer Science &amp; Engineering · Degree: B.Tech (4 Years)
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {myEnrollments.map((enr) => (
                <div key={enr.id} className="py-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Semester {enr.semester}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-slate-600">AY {enr.academicYear}</span>
                      <StatusBadge status={enr.status} />
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      Class Section: <strong>{enr.classGroupName}</strong> · Registered: <strong>{enr.creditsRegistered}</strong> Credits
                    </div>
                    {enr.remarks && <p className="text-[11px] text-slate-400 italic mt-0.5">{enr.remarks}</p>}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{enr.enrollmentDate}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close History
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
