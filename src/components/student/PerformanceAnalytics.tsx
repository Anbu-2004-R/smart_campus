import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Lightbulb,
  GraduationCap,
  ChevronRight,
  HelpCircle,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  Legend,
  ReferenceLine,
  ComposedChart,
} from 'recharts';

export const PerformanceAnalytics: React.FC = () => {
  const { currentStudentProfile } = useAuth();
  const { semesterResults, studentMarks, subjects, exams } = useERP();

  const studentId = currentStudentProfile?.id || 'stu-1';
  const isLeadStudent = studentId === 'stu-1';

  // State for interactive metric toggles
  const [activeTab, setActiveTab] = useState<'COURSES' | 'PROGRESSION' | 'DOMAINS'>('COURSES');
  const [selectedTerm, setSelectedTerm] = useState<'SEM4' | 'SEM5'>('SEM4');

  // Semester Progression: Student GPA vs Batch Cohort Average
  const gpaProgressionData = [
    {
      semester: 'Sem 1',
      studentGpa: isLeadStudent ? 9.1 : 6.8,
      courseAverage: 7.82,
      topDecile: 9.35,
      delta: isLeadStudent ? '+1.28' : '-1.02',
    },
    {
      semester: 'Sem 2',
      studentGpa: isLeadStudent ? 9.25 : 7.1,
      courseAverage: 7.94,
      topDecile: 9.42,
      delta: isLeadStudent ? '+1.31' : '-0.84',
    },
    {
      semester: 'Sem 3',
      studentGpa: isLeadStudent ? 9.38 : 7.05,
      courseAverage: 8.02,
      topDecile: 9.48,
      delta: isLeadStudent ? '+1.36' : '-0.97',
    },
    {
      semester: 'Sem 4',
      studentGpa: isLeadStudent ? 9.5 : 7.2,
      courseAverage: 8.1,
      topDecile: 9.55,
      delta: isLeadStudent ? '+1.40' : '-0.90',
    },
    {
      semester: 'Sem 5 (Current)',
      studentGpa: isLeadStudent ? 9.45 : 6.9,
      courseAverage: 7.98,
      topDecile: 9.5,
      delta: isLeadStudent ? '+1.47' : '-1.08',
    },
  ];

  // Semester 4 Course-wise comparison
  const sem4ComparativeData = [
    {
      code: 'CS401',
      name: 'Theory of Computation',
      credits: 4,
      studentScore: isLeadStudent ? 94 : 65,
      courseAverage: 74.5,
      highestScore: 96,
      studentGrade: isLeadStudent ? 'O' : 'B+',
      percentile: isLeadStudent ? 98 : 45,
      domain: 'Theory & Logic',
    },
    {
      code: 'CS402',
      name: 'Microprocessors & Microcontrollers',
      credits: 3,
      studentScore: isLeadStudent ? 86 : 68,
      courseAverage: 72.8,
      highestScore: 92,
      studentGrade: isLeadStudent ? 'A+' : 'B+',
      percentile: isLeadStudent ? 89 : 48,
      domain: 'Computer Systems',
    },
    {
      code: 'CS403',
      name: 'Software Engineering',
      credits: 3,
      studentScore: isLeadStudent ? 90 : 70,
      courseAverage: 76.2,
      highestScore: 94,
      studentGrade: isLeadStudent ? 'O' : 'A',
      percentile: isLeadStudent ? 94 : 52,
      domain: 'Software Architecture',
    },
    {
      code: 'CS404',
      name: 'Probability & Queueing Theory',
      credits: 4,
      studentScore: isLeadStudent ? 88 : 62,
      courseAverage: 71.0,
      highestScore: 93,
      studentGrade: isLeadStudent ? 'A+' : 'B',
      percentile: isLeadStudent ? 91 : 40,
      domain: 'Applied Mathematics',
    },
  ];

  // Semester 5 Midterm Assessment comparison
  const sem5ComparativeData = [
    {
      code: 'CS501',
      name: 'Operating Systems',
      credits: 4,
      studentScore: isLeadStudent ? 92 : 55,
      courseAverage: 75.4,
      highestScore: 95,
      studentGrade: isLeadStudent ? 'O' : 'B',
      percentile: isLeadStudent ? 96 : 38,
      domain: 'Systems & Kernel',
    },
    {
      code: 'CS502',
      name: 'Database Management Systems',
      credits: 4,
      studentScore: isLeadStudent ? 88 : 48,
      courseAverage: 73.6,
      highestScore: 92,
      studentGrade: isLeadStudent ? 'A+' : 'C',
      percentile: isLeadStudent ? 92 : 28,
      domain: 'Data Architecture',
    },
    {
      code: 'CS503',
      name: 'Computer Networks',
      credits: 3,
      studentScore: isLeadStudent ? 84 : 46,
      courseAverage: 72.0,
      highestScore: 90,
      studentGrade: isLeadStudent ? 'A+' : 'C',
      percentile: isLeadStudent ? 88 : 25,
      domain: 'Networking & Protocols',
    },
    {
      code: 'CS504',
      name: 'Design & Analysis of Algorithms',
      credits: 4,
      studentScore: isLeadStudent ? 91 : 58,
      courseAverage: 70.8,
      highestScore: 94,
      studentGrade: isLeadStudent ? 'O' : 'B',
      percentile: isLeadStudent ? 95 : 42,
      domain: 'Theory & Logic',
    },
    {
      code: 'CS505',
      name: 'Operating Systems Laboratory',
      credits: 2,
      studentScore: isLeadStudent ? 96 : 60,
      courseAverage: 81.5,
      highestScore: 98,
      studentGrade: isLeadStudent ? 'O' : 'B+',
      percentile: isLeadStudent ? 97 : 46,
      domain: 'Applied Practice',
    },
  ];

  const activeCourseData = selectedTerm === 'SEM4' ? sem4ComparativeData : sem5ComparativeData;

  // Domain Proficiency Aggregate
  const domainData = [
    {
      domain: 'Theory & Logic',
      studentAvg: isLeadStudent ? 92.5 : 61.5,
      cohortAvg: 72.6,
      delta: isLeadStudent ? +19.9 : -11.1,
      courses: 'CS401, CS504',
    },
    {
      domain: 'Computer Systems',
      studentAvg: isLeadStudent ? 89.0 : 61.5,
      cohortAvg: 74.1,
      delta: isLeadStudent ? +14.9 : -12.6,
      courses: 'CS402, CS501',
    },
    {
      domain: 'Data & Networking',
      studentAvg: isLeadStudent ? 86.0 : 47.0,
      cohortAvg: 72.8,
      delta: isLeadStudent ? +13.2 : -25.8,
      courses: 'CS502, CS503',
    },
    {
      domain: 'Applied Software',
      studentAvg: isLeadStudent ? 93.0 : 65.0,
      cohortAvg: 78.8,
      delta: isLeadStudent ? +14.2 : -13.8,
      courses: 'CS403, CS505',
    },
  ];

  // Derived KPI metrics
  const avgStudentScore = Math.round(
    activeCourseData.reduce((acc, curr) => acc + curr.studentScore, 0) / activeCourseData.length
  );
  const avgCourseBenchmark = Math.round(
    activeCourseData.reduce((acc, curr) => acc + curr.courseAverage, 0) / activeCourseData.length
  );
  const overallDelta = avgStudentScore - avgCourseBenchmark;
  const coursesAboveAvgCount = activeCourseData.filter(
    (c) => c.studentScore >= c.courseAverage
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 font-mono">
              Academic Intelligence &amp; Benchmarking
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">Section 4.3.5 Comparative Analytics</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Performance Analytics &amp; Course Cohort Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate individual academic scores against course batch averages, identify cognitive strengths, and review actionable improvement guidance.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('COURSES')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'COURSES'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Course Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('PROGRESSION')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'PROGRESSION'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GPA Progression vs Batch
          </button>
          <button
            onClick={() => setActiveTab('DOMAINS')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'DOMAINS'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skill Domains
          </button>
        </div>
      </div>

      {/* Comparative Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Cohort Relative Standing</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {isLeadStudent ? 'Top 3.5%' : 'Top 58%'}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              {isLeadStudent ? 'Percentile 96.5' : 'Percentile 42.0'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Ranked across 480 B.Tech CSE peers
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Average Score Advantage</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-2xl font-bold font-mono ${
                overallDelta >= 0 ? 'text-indigo-600' : 'text-rose-600'
              }`}
            >
              {overallDelta >= 0 ? `+${overallDelta} pts` : `${overallDelta} pts`}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              vs {avgCourseBenchmark} avg
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {overallDelta >= 0
              ? 'Consistently exceeds course average'
              : 'Requires intervention in targeted modules'}
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Courses Above Benchmark</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {coursesAboveAvgCount} / {activeCourseData.length}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 font-mono">
              {Math.round((coursesAboveAvgCount / activeCourseData.length) * 100)}% Clearance
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {coursesAboveAvgCount === activeCourseData.length
              ? 'Complete multi-course outperformance'
              : '1 course near class mean'}
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Dean&apos;s Honours Index</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-600">
              {isLeadStudent ? '9.42' : '7.05'}
            </span>
            <span className="text-[11px] font-semibold text-slate-600 font-mono">
              Threshold: &ge; 8.50
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isLeadStudent ? 'Eligible for First Class Distinction' : 'Regular academic standing'}
          </span>
        </div>
      </div>

      {/* TAB 1: COURSE-BY-COURSE COMPARATIVE PERFORMANCE */}
      {activeTab === 'COURSES' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Course Marks vs. Course Batch Averages
                </h3>
                <p className="text-xs text-slate-500">
                  Comparing personal scores against cohort average and highest recorded grade
                </p>
              </div>

              {/* Term Picker */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <button
                  onClick={() => setSelectedTerm('SEM4')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    selectedTerm === 'SEM4'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semester 4 (Published)
                </button>
                <button
                  onClick={() => setSelectedTerm('SEM5')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    selectedTerm === 'SEM5'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semester 5 (Current / Midterm)
                </button>
              </div>
            </div>

            {/* Recharts Grouped Comparative Visualization */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeCourseData}
                  margin={{ top: 20, right: 20, left: -15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="code"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    domain={[40, 100]}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      padding: '10px 14px',
                    }}
                    formatter={(val: any, name?: any) => [
                      `${val} / 100`,
                      name === 'studentScore'
                        ? 'Your Score'
                        : name === 'courseAverage'
                        ? 'Course Average'
                        : 'Cohort Top Score',
                    ]}
                    labelFormatter={(label) => {
                      const item = activeCourseData.find((d) => d.code === label);
                      return `${label}: ${item?.name || ''}`;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    formatter={(val) =>
                      val === 'studentScore'
                        ? 'Your Score'
                        : val === 'courseAverage'
                        ? 'Course Average (Batch)'
                        : 'Highest Recorded Score'
                    }
                  />
                  <Bar
                    dataKey="studentScore"
                    fill="#4f46e5"
                    name="studentScore"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="courseAverage"
                    fill="#94a3b8"
                    name="courseAverage"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="highestScore"
                    fill="#cbd5e1"
                    name="highestScore"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" />
                  <span>Your Score</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block" />
                  <span>Course Batch Average</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 inline-block" />
                  <span>Batch Top Score</span>
                </span>
              </div>
              <span className="font-mono text-slate-400">
                Evaluation Metric: Scaled Score (/100)
              </span>
            </div>
          </div>

          {/* Detailed Course Breakdown Table with Deviation Badges */}
          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Detailed Course Variance &amp; Percentile Analysis
                </h3>
                <p className="text-[11px] text-slate-500">
                  Individual score differential calculated against normalized cohort baseline
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {activeCourseData.length} Evaluated Courses
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Course Code &amp; Title</th>
                    <th className="px-4 py-3">Domain</th>
                    <th className="px-4 py-3">Your Score</th>
                    <th className="px-4 py-3">Course Average</th>
                    <th className="px-4 py-3">Cohort Top</th>
                    <th className="px-4 py-3">Performance Delta</th>
                    <th className="px-5 py-3 text-right">Percentile Standing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {activeCourseData.map((item) => {
                    const delta = Math.round((item.studentScore - item.courseAverage) * 10) / 10;
                    const isPositive = delta >= 0;

                    return (
                      <tr key={item.code} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900 font-mono">{item.code}</div>
                          <div className="text-slate-600 font-medium">{item.name}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {item.domain}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono">
                          <span className="text-sm font-bold text-slate-900">{item.studentScore}</span>
                          <span className="text-[11px] text-indigo-700 font-bold ml-1.5">
                            ({item.studentGrade})
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-600 font-medium">
                          {item.courseAverage.toFixed(1)}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-400">
                          {item.highestScore}
                        </td>
                        <td className="px-4 py-3.5 font-mono">
                          <span
                            className={`inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded ${
                              isPositive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {isPositive ? (
                              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                            )}
                            <span>{isPositive ? `+${delta}` : `${delta}`} pts</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono">
                          <div className="font-bold text-slate-900 text-xs">
                            Top {100 - item.percentile}%
                          </div>
                          <div className="w-20 bg-slate-200 rounded-full h-1.5 ml-auto mt-1 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full"
                              style={{ width: `${item.percentile}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEMESTER GPA PROGRESSION VS COHORT */}
      {activeTab === 'PROGRESSION' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Semester GPA Trajectory vs. Batch Average &amp; Top Decile
                </h3>
                <p className="text-xs text-slate-500">
                  Longitudinal semester-by-semester comparison demonstrating academic consistency
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Avg Delta: +1.38 GPA
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={gpaProgressionData}
                  margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="semester"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    domain={[6.0, 10.0]}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name?: any) => [
                      `${val}`,
                      name === 'studentGpa'
                        ? 'Your Semester GPA'
                        : name === 'courseAverage'
                        ? 'Batch Cohort Average'
                        : 'Top Decile Threshold',
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    formatter={(val) =>
                      val === 'studentGpa'
                        ? 'Your Semester GPA'
                        : val === 'courseAverage'
                        ? 'Batch Average GPA'
                        : 'Top Decile Threshold (90th percentile)'
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="studentGpa"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#4f46e5' }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="courseAverage"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#94a3b8' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="topDecile"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="2 2"
                    dot={{ r: 3, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-700">
                Consistently maintains upper decile placement across all academic terms.
              </span>
              <span className="font-mono text-indigo-600 font-bold">10-Point Scale UGC Rule</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPETENCY DOMAINS */}
      {activeTab === 'DOMAINS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domainData.map((dom) => (
              <div
                key={dom.domain}
                className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-900">{dom.domain}</h4>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        dom.delta >= 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {dom.delta >= 0 ? `+${dom.delta}% advantage` : `${dom.delta}% deficit`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Assessed across subjects: <strong className="font-mono text-slate-700">{dom.courses}</strong>
                  </p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-600">Your Average Mastery</span>
                        <span className="font-bold text-indigo-700">{dom.studentAvg}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${dom.studentAvg}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-600">Cohort Benchmark Average</span>
                        <span className="font-semibold text-slate-600">{dom.cohortAvg}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-slate-400 h-full rounded-full"
                          style={{ width: `${dom.cohortAvg}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Standardized Syllabus Weight</span>
                  <span className="font-mono font-semibold text-slate-700">Validated Outcome</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIONABLE ACADEMIC INSIGHTS & ADVISORY PANEL */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900">
            Actionable Academic Insights &amp; Strategic Roadmap
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Grounded in validated comparative differentials, advising on honors trajectory, elective selection, and study effort allocation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Core Outperformance Strength */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Primary Academic Lead (Theory &amp; Logic)</span>
              </div>
              <p className="text-xs text-emerald-900/90 leading-relaxed">
                Outperforming class mean by <strong className="font-mono text-emerald-950">+19.5 pts</strong> in Theory of Computation and <strong className="font-mono text-emerald-950">+15.4 pts</strong> in Algorithms. Demonstrates superior abstract problem-solving and mathematical proof capability.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-emerald-200/60 text-[11px] text-emerald-800">
              <strong>Actionable Next Step:</strong> Eligible for Departmental Teaching Assistantship (TA) and faculty research fellowship in theoretical computer science.
            </div>
          </div>

          {/* Card 2: Strategic Elective Optimization */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs mb-1.5">
                <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Semester 6 Elective Recommendations</span>
              </div>
              <p className="text-xs text-indigo-900/90 leading-relaxed">
                Comparative high scores in Operating Systems (92 vs 75.4 avg) and Lab Practice (96 vs 81.5 avg) highlight exceptional systems proficiency.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-indigo-200/60 text-[11px] text-indigo-800">
              <strong>Actionable Next Step:</strong> Select <em>Advanced Distributed Systems (CS601)</em> and <em>Compiler Engineering (CS603)</em> to maximize honors credits.
            </div>
          </div>

          {/* Card 3: Targeted Growth & Effort Calibration */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs mb-1.5">
                <Target className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Targeted Growth &amp; Study Allocation</span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                Computer Networks shows your narrowest lead over class average (+12 pts; 84 vs 72.0). TCP/IP protocol state machines and subnetting require focused review before End Semester Examinations.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-amber-200/60 text-[11px] text-amber-800">
              <strong>Actionable Next Step:</strong> Allocate 2 hours/week to packet tracing problem sets and consult Prof. Priya Nair during Tuesday faculty office hours.
            </div>
          </div>
        </div>

        {/* Study Time Allocation Recommendation Strip */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-slate-200 text-indigo-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                Recommended Weekly Study Effort Distribution
              </span>
              <span className="text-slate-500 text-[11px]">
                Calibrated based on course variance: 40% Systems &amp; Networks · 35% Algorithms &amp; DBMS · 25% Theory maintenance
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded font-semibold text-[11px]">
              Target: Maintain &ge; 9.40 CGPA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
