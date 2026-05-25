import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, BarChart3, CheckCircle, XCircle, Sparkles, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../../context/ToastContext';
import { getDriveDetails, aiShortlist, updateApplicantStatus } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function DriveDetails() {
  const { driveId } = useParams();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { fetchData(); }, [driveId]);

  const fetchData = async () => {
    try { const { data: d } = await getDriveDetails(driveId); setData(d); }
    catch { addToast('Failed to load drive.', 'error'); }
    finally { setLoading(false); }
  };

  const handleAiShortlist = async () => {
    setAiLoading(true);
    try { const { data: r } = await aiShortlist(driveId); setAiResult(r); addToast('AI shortlist generated!', 'success'); }
    catch { addToast('AI shortlist failed.', 'error'); }
    finally { setAiLoading(false); }
  };

  const handleStatus = async (appId, status) => {
    setUpdating(appId);
    try { await updateApplicantStatus(driveId, appId, status); addToast(`Student ${status}!`, 'success'); fetchData(); }
    catch { addToast('Failed to update.', 'error'); }
    finally { setUpdating(null); }
  };

  if (loading) return <LoadingSpinner message="Loading drive details..." />;
  if (!data) return null;

  const { drive, applicants } = data;
  const avgMatch = applicants.length > 0 ? Math.round(applicants.reduce((s, a) => s + (a.matchPercentage || 0), 0) / applicants.length) : 0;

  // Match distribution for chart
  const distBuckets = [0, 0, 0, 0, 0]; // 0-20, 20-40, 40-60, 60-80, 80-100
  applicants.forEach(a => { const idx = Math.min(Math.floor((a.matchPercentage || 0) / 20), 4); distBuckets[idx]++; });
  const distData = ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'].map((label, i) => ({ range: label, count: distBuckets[i] }));

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-mesh">
      <div className="max-w-6xl mx-auto relative z-10">
        <Link to="/tpo/dashboard" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>

        {/* Header */}
        <div className="glass-card p-6 mb-6 border border-emerald-500/10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl font-bold text-white shadow-md shadow-emerald-500/10">{drive.companyName?.[0]}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-slate-800">{drive.companyName}</h1>
              <p className="text-sm text-slate-500">{drive.jobRole} · {drive.packageLPA} LPA · {drive.driveType}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-400" /> {new Date(drive.driveDate).toLocaleDateString('en-IN')}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4 text-slate-400" /> {applicants.length}/{drive.seatsAvailable || '∞'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'applicants', 'analytics'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'overview' && (
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 text-center"><p className="text-3xl font-black text-emerald-600">{applicants.length}</p><p className="text-xs text-slate-500 font-medium">Applicants</p></div>
            <div className="glass-card p-5 text-center"><p className="text-3xl font-black text-cyan-600">{avgMatch}%</p><p className="text-xs text-slate-500 font-medium">Avg Match</p></div>
            <div className="glass-card p-5 text-center"><p className="text-3xl font-black text-amber-600">{drive.requiredSkills?.length || 0}</p><p className="text-xs text-slate-500 font-medium">Required Skills</p></div>
            <div className="sm:col-span-3 glass-card p-5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-1.5">{(drive.requiredSkills || []).map(s => <span key={s} className="skill-tag skill-tag-green">{s}</span>)}</div>
            </div>
            {drive.description && <div className="sm:col-span-3 glass-card p-5"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</p><p className="text-sm text-slate-750 leading-relaxed">{drive.description}</p></div>}
          </div>
        )}

        {tab === 'applicants' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{applicants.length} applicant(s)</p>
              <button onClick={handleAiShortlist} disabled={aiLoading || applicants.length === 0}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2 text-sm disabled:opacity-40">
                <Sparkles className="w-4 h-4" /> {aiLoading ? 'AI Thinking...' : '🤖 AI Shortlist'}
              </button>
            </div>

            {/* AI Result */}
            {aiResult && (
              <div className="glass-card p-6 animate-slide-up border border-emerald-500/10">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> AI Recommendation</h3>
                <p className="text-sm text-slate-700 mb-4">{aiResult.summary}</p>
                {aiResult.shortlisted?.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-2">
                    <span className="text-lg">{['🥇','🥈','🥉'][i] || `#${i+1}`}</span>
                    <div className="flex-1"><p className="text-sm font-bold text-slate-800">{s.name}</p><p className="text-xs text-slate-500">{s.reason}</p></div>
                    <span className="text-sm font-bold text-emerald-600">{s.score}/100</span>
                  </div>
                ))}
              </div>
            )}

            {/* Applicant List */}
            {applicants.map(a => {
              const mc = a.matchPercentage >= 70 ? 'text-emerald-650 font-black' : a.matchPercentage >= 50 ? 'text-amber-600 font-black' : 'text-rose-600 font-black';
              const statusColors = { 
                applied: 'bg-blue-50 text-blue-700 border border-blue-100', 
                shortlisted: 'bg-emerald-50 text-emerald-700 border border-emerald-100', 
                selected: 'bg-amber-50 text-amber-705 border border-amber-100', 
                rejected: 'bg-slate-100 text-slate-600 border border-slate-200' 
              };
              return (
                <div key={a._id} className="glass-card p-4 flex flex-wrap items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-750">{a.studentName?.[0]}</div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/tpo/students/${a.studentId}`} className="text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors">{a.studentName}</Link>
                    <p className="text-xs text-slate-500">{a.branch} · Sem {a.semester} · CGPA {a.cgpa}</p>
                  </div>
                  <span className={`text-lg ${mc}`}>{a.matchPercentage}%</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[a.status] || ''}`}>{a.status}</span>
                  {a.status === 'applied' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleStatus(a._id, 'shortlisted')} disabled={updating === a._id}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Shortlist
                      </button>
                      <button onClick={() => handleStatus(a._id, 'rejected')} disabled={updating === a._id}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-all flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {applicants.length === 0 && <div className="glass-card p-12 text-center"><p className="text-slate-500">No applicants yet</p></div>}
          </div>
        )}

        {tab === 'analytics' && (
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Match % Distribution</h3>
            <div className="h-64" style={{ minHeight: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distData}>
                  <XAxis dataKey="range" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, color: '#1e293b' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
