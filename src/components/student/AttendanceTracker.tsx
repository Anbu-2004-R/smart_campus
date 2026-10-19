import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import {
  CalendarCheck,
  AlertTriangle,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  Info,
  Calendar,
  History,
} from 'lucide-react';
import { AttendanceStatus } from '../../types/erp';

export const AttendanceTracker: React.FC = () => {
  const { currentStudentProfile } = useAuth();
  const {
    calculateStudentAttendance,
    attendanceRecords,
    classSessions,
    subjects,
    correctionRequests,
    submitAttendanceCorrection,
  } = useERP();

  const studentId = currentStudentProfile?.id || 'stu-1';
  const summary = calculateStudentAttendance(studentId);

  // Correction requests by this student
  const myCorrectionRequests = correctionRequests.filter((r) => r.studentId === studentId);

  // Absences of this student
  const studentRecs = attendanceRecords.filter((r) => r.studentId === studentId);
  const sessionMap = new Map(classSessions.map((s) => [s.id, s]));

  const absences = studentRecs
    .filter((r) => r.status === 'ABSENT' || r.status === 'LATE')
    .map((r) => {
      const session = sessionMap.get(r.sessionId);
      const sub = subjects.find((s) => s.id === session?.subjectId);
      return {
        record: r,
        session,
        subject: sub,
      };
    })
    .filter((a) => a.session !== undefined);

  // Request correction modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [requestedStatus, setRequestedStatus] = useState<AttendanceStatus>('PRESENT');
  const [reason, setReason] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [submittedMsg, setSubmittedMsg] = useState(false);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    // Find session or fallback to mock session id
    const matchedSession = classSessions.find(
      (s) => s.subjectId === selectedSubjectId && s.date === selectedDate
    );
    const sessionId = matchedSession?.id || `sess-auto-${Date.now()}`;

    submitAttendanceCorrection({
      studentId,
      sessionId,
      subjectId: selectedSubjectId,
      sessionDate: selectedDate,
      originalStatus: 'ABSENT',
      requestedStatus,
      reason: reason.trim(),
      evidenceNote: evidenceNote.trim() || undefined,
    });

    setIsModalOpen(false);
    setReason('');
    setEvidenceNote('');
    setSubmittedMsg(true);
    setTimeout(() => setSubmittedMsg(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Official Attendance Register & Risk Analysis</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time biometric & faculty attendance tracking. Mandated 75.0% minimum threshold for semester exam clearance.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Apply for Attendance Correction</span>
        </button>
      </div>

      {submittedMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            Attendance correction request logged. Eligible requests (&le;7 days) are routed to your subject faculty; late requests to the Registrar.
          </div>
        </div>
      )}

      {/* Attendance & Risk Status Overview Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Overall Cumulative Attendance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {summary.overallPercentage}%
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ({summary.attendedClasses} / {summary.totalClasses} classes attended)
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={summary.riskLevel} />
              <span className="text-xs text-slate-500">
                {summary.riskLevel === 'LOW'
                  ? 'Safe Exam Standing'
                  : summary.riskLevel === 'MEDIUM'
                  ? 'Approaching 75% Cutoff'
                  : 'Critical: Ineligible for Exams'}
              </span>
            </div>
          </div>

          <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Institutional Attendance Rules (Section 4.1.2 & Decision D-1)</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-600">
              - <strong>7-Day Correction Window:</strong> Requests submitted within 7 days from the class session date are reviewed by the assigned subject faculty.
            </p>
            <p className="leading-relaxed text-[11px] text-slate-600">
              - <strong>Late Submissions:</strong> Requests filed after 7 days require special justification and are routed directly to the Administrator for approval.
            </p>
          </div>
        </div>
      </div>

      {/* Subject-wise Cards */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Subject-wise Attendance Breakdown</h3>
        <p className="text-xs text-slate-500 mb-4">Click any course to review syllabus attendance percentage</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.subjectWise.map((sub) => (
            <div key={sub.subjectId} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-900">{sub.subjectCode}</span>
                <StatusBadge status={sub.riskLevel} />
              </div>
              <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{sub.subjectName}</h4>

              <div className="mt-3 flex items-baseline justify-between text-xs">
                <span className="font-mono text-lg font-bold text-slate-900">{sub.percentage}%</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {sub.attended} / {sub.total} classes
                </span>
              </div>

              <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    sub.percentage >= 80 ? 'bg-emerald-500' : sub.percentage >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column: Recorded Absences & Filed Correction Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recorded Absences List */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Absence Records</h3>
              <p className="text-xs text-slate-500">Unattended sessions eligible for correction review</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{absences.length} Entries</span>
          </div>

          <div className="divide-y divide-slate-100">
            {absences.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No recorded absences for the current academic session.
              </div>
            ) : (
              absences.map(({ record, session, subject }) => (
                <div key={record.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{subject?.code}</span>
                      <span className="text-xs text-slate-700">{subject?.name}</span>
                      <StatusBadge status={record.status} />
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Date: <span className="font-mono font-medium text-slate-800">{session?.date}</span> · Period: {session?.period} ({session?.roomNumber})
                    </div>
                    {session?.topicCovered && (
                      <p className="text-[11px] text-slate-400 italic mt-0.5">Topic: {session.topicCovered}</p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSubjectId(subject?.id || subjects[0]?.id);
                      setSelectedDate(session?.date || new Date().toISOString().split('T')[0]);
                      setIsModalOpen(true);
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors whitespace-nowrap"
                  >
                    Request Correction
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Filed Correction Requests Status */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Submitted Correction Requests</h3>
              <p className="text-xs text-slate-500">Tracking approval and reviewer decisions</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{myCorrectionRequests.length} Filed</span>
          </div>

          <div className="divide-y divide-slate-100">
            {myCorrectionRequests.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No correction requests submitted.
              </div>
            ) : (
              myCorrectionRequests.map((req) => {
                const sub = subjects.find((s) => s.id === req.subjectId);
                return (
                  <div key={req.id} className="py-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{sub?.code}</span>
                        <span className="text-[11px] font-mono text-slate-500">{req.sessionDate}</span>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>

                    <div className="text-xs text-slate-600">
                      Requested: <strong className="text-emerald-700">{req.requestedStatus}</strong> (was {req.originalStatus})
                    </div>

                    <p className="text-[11px] text-slate-500 italic">&ldquo;{req.reason}&rdquo;</p>

                    {req.reviewRemarks && (
                      <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700 mt-1">
                        <strong>Decision note by {req.reviewedBy}:</strong> {req.reviewRemarks}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Correction Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Attendance Correction Request"
        subtitle="Review 7-day window rule before submitting."
      >
        <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              {subjects
                .filter((s) => s.semester === 5)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Class Session Date</label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Requested Attendance</label>
              <select
                value={requestedStatus}
                onChange={(e) => setRequestedStatus(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="PRESENT">Present</option>
                <option value="ON_DUTY">On Duty (OD)</option>
                <option value="LATE">Late (Excusable)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Mandatory Reason *</label>
            <textarea
              rows={3}
              required
              placeholder="State clear reason (e.g. Attended conference with OD permission, biometric malfunction)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Evidence Reference / Certificate ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Medical Certificate #MED-8812 or OD Letter #OD-2026-44"
              value={evidenceNote}
              onChange={(e) => setEvidenceNote(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            * Per Academic Policy D-1, requests older than 7 days from the class date require special administrative clearance.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Submit for Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
