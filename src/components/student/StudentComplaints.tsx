import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import {
  LifeBuoy,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintPriority } from '../../types/erp';

export const StudentComplaints: React.FC = () => {
  const { currentStudentProfile, currentUser } = useAuth();
  const { complaints, submitComplaint } = useERP();

  const studentUserId = currentUser?.id || 'usr-stu-1';
  const myComplaints = complaints.filter((c) => c.submittedByUserId === studentUserId);

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('ACADEMIC');
  const [requestedPriority, setRequestedPriority] = useState<ComplaintPriority>('MEDIUM');
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    submitComplaint({
      title: title.trim(),
      description: description.trim(),
      category,
      requestedPriority,
      submittedByUserId: studentUserId,
      submitterName: currentStudentProfile?.fullName || 'Student',
      submitterRole: 'STUDENT',
      submitterEmail: currentUser?.email || 'student@smartcampus.edu',
    });

    setIsSubmitOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Student Grievance Redressal & Support</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit academic, hostel, infrastructure, or attendance grievances. Track official resolution timelines with complete traceability (Section 4.3.6).
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>File New Grievance</span>
        </button>
      </div>

      {/* Grievances List */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Ticket ID & Subject</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority (Req / Confirmed)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned Faculty</th>
                <th className="px-4 py-3">Filed On</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {myComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    You have not submitted any complaints.
                  </td>
                </tr>
              ) : (
                myComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-[11px] text-slate-500">{item.ticketNumber}</div>
                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-[260px]">{item.title}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{item.category}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={item.officialPriority} />
                        {item.requestedPriority !== item.officialPriority && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            (Req: {item.requestedPriority})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {item.assignedFacultyName || <span className="text-slate-400 italic">Under Review</span>}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-500 text-[11px]">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedTicket(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                      >
                        Timeline & Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Complaint Modal */}
      <Modal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        title="Submit Academic or Campus Grievance"
        subtitle="Assigned to the relevant faculty or administrative department."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Issue Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Attendance discrepancy after attending tech symposium with OD"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="ACADEMIC">Academic</option>
                <option value="ATTENDANCE">Attendance</option>
                <option value="HOSTEL">Hostel</option>
                <option value="INFRASTRUCTURE">Infrastructure</option>
                <option value="GENERAL">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Requested Priority (D-2/D-5)
              </label>
              <select
                value={requestedPriority}
                onChange={(e) => setRequestedPriority(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="LOW">Low (General Query)</option>
                <option value="MEDIUM">Medium (Standard)</option>
                <option value="HIGH">High (Urgent)</option>
                <option value="CRITICAL">Critical (Immediate Block)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={4}
              required
              placeholder="Describe the problem, dates, locations, and any prior communications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            * Per Decision D-2, submitters request a priority; Administrator reviews and confirms or adjusts official priority based on institutional guidelines.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsSubmitOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Submit Grievance
            </button>
          </div>
        </form>
      </Modal>

      {/* Ticket Details & Live Timeline Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket ${selectedTicket.ticketNumber}`}
          subtitle={selectedTicket.title}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[11px] mb-0.5">Submitted Description</span>
              <p className="text-slate-800 leading-relaxed">{selectedTicket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block">Category</span>
                <span className="font-semibold text-slate-900">{selectedTicket.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Official Priority</span>
                <StatusBadge status={selectedTicket.officialPriority} />
              </div>
              <div>
                <span className="text-slate-400 block">Assigned Staff</span>
                <span className="font-semibold text-slate-900">
                  {selectedTicket.assignedFacultyName || 'Under Administrative Assignment'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Current Status</span>
                <StatusBadge status={selectedTicket.status} />
              </div>
            </div>

            {selectedTicket.resolutionNotes && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                <span className="font-bold block mb-0.5">Official Resolution Note</span>
                <p className="text-[11px] leading-relaxed">{selectedTicket.resolutionNotes}</p>
              </div>
            )}

            {selectedTicket.rejectionReason && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                <span className="font-bold block mb-0.5">Rejection Explanation (Section 4.1.9)</span>
                <p className="text-[11px] leading-relaxed">{selectedTicket.rejectionReason}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Live Resolution Timeline
              </span>
              <div className="space-y-2">
                {selectedTicket.timeline.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{step.status}</span>
                      <span className="text-slate-400 mx-1">·</span>
                      <span className="text-slate-600">{step.changedBy}</span>
                      <span className="text-slate-400 font-mono mx-1">
                        ({new Date(step.timestamp).toLocaleDateString()})
                      </span>
                      {step.notes && <p className="text-slate-600 mt-0.5">{step.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
