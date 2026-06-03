import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, BarChart3, Trophy, Briefcase, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getTpoStudentProfile } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function StudentProfile() {
  const { studentId } = useParams();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [studentId]);

  const fetchData = async () => {
    try { const { data: d } = await getTpoStudentProfile(studentId); setData(d); }
    catch { addToast('Failed to load student.', 'error'); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner message="Loading student..." />;
  if (!data) return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-mesh">
      <div className="glass-card p-8 text-center max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to load data</h2>
        <p className="text-slate-500 mb-6">There was an issue fetching the student profile.</p>
        <button onClick={() => window.location.reload()} className="btn-primary w-full">Refresh Page</button>
      </div>
    </div>
  );

  const { student, roadmap, progress, applications, achievements } = data;
  const completedWeeks = roadmap ? (roadmap.weeks || []).filter(w => w.completed).length : 0;
  const totalHours = (progress || []).reduce((s, p) => s + (p.hoursSpent || 0), 0);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-mesh">
      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/tpo/dashboard" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 mb-6"><ArrowLeft className="w-4 h-4" /> Back</Link>

        {/* Header */}
        <div className="glass-card p-6 mb-6 border border-emerald-500/10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl font-bold text-white shadow-md shadow-emerald-500/10">{student.name?.[0]}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-slate-800">{student.name}</h1>
              <p className="text-sm text-slate-500">{student.branch} · Sem {student.semester} · CGPA {student.cgpa} · {student.college}</p>
            </div>
            <div className="text-center"><p className="text-4xl font-black text-emerald-600">{student.placementScore || 0}%</p><p className="text-xs text-slate-500 font-medium">Score</p></div>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: GraduationCap, label: 'CGPA', value: student.cgpa, colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { icon: BarChart3, label: 'Progress', value: `${completedWeeks}/${roadmap?.totalWeeks || 0}`, colorClass: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
            { icon: Clock, label: 'Hours', value: totalHours, colorClass: 'text-amber-600 bg-amber-50 border-amber-100' },
            { icon: Briefcase, label: 'Apps', value: applications?.length || 0, colorClass: 'text-purple-600 bg-purple-50 border-purple-100' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <div className={`w-8 h-8 rounded-lg ${s.colorClass.split(' ').slice(1).join(' ')} border flex items-center justify-center mx-auto mb-2`}>
                <s.icon className={`w-4 h-4 ${s.colorClass.split(' ')[0]}`} />
              </div>
              <p className={`text-xl font-black ${s.colorClass.split(' ')[0]}`}>{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Skills */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Skills</h3>
            <div className="flex flex-wrap gap-1.5">{(student.skills || []).map(s => <span key={s} className="skill-tag">{s}</span>)}</div>
          </div>

          {/* Achievements */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {(achievements || []).map(a => (
                <span key={a.type || a._id} className={`text-2xl ${a.earned ? '' : 'grayscale opacity-30'}`} title={a.title}>{a.title?.split(' ')[0] || '🎯'}</span>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div className="sm:col-span-2 glass-card p-5">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Drive Applications</h3>
            <div className="space-y-2">
              {(applications || []).map(a => {
                const appColors = a.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : a.status === 'selected' ? 'bg-amber-50 text-amber-705 border-amber-100' : a.status === 'rejected' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-blue-50 text-blue-700 border-blue-100';
                return (
                  <div key={a._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div><p className="text-sm font-semibold text-slate-800">{a.driveId?.companyName || 'Drive'}</p><p className="text-xs text-slate-500">{a.driveId?.jobRole} · {a.driveId?.packageLPA} LPA</p></div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize border ${appColors}`}>{a.status}</span>
                  </div>
                );
              })}
              {(!applications || applications.length === 0) && <p className="text-xs text-slate-500">No applications yet</p>}
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="sm:col-span-2 glass-card p-5">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Progress Timeline</h3>
            <div className="space-y-2">
              {(progress || []).slice(0, 10).map(p => (
                <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">W{p.weekNumber}</div>
                  <div className="flex-1"><p className="text-sm text-slate-800 font-semibold">Week {p.weekNumber} · {p.hoursSpent}h · {p.selfRating}/5</p>
                  <p className="text-xs text-slate-500">{(p.skillsLearned || []).join(', ')}</p></div>
                  <p className="text-xs text-slate-400 font-medium">{new Date(p.date).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
              {(!progress || progress.length === 0) && <p className="text-xs text-slate-500">No check-ins yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
