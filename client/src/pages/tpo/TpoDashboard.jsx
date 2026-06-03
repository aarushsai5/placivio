import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Trophy, BarChart3, Plus, AlertTriangle, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getTpoDashboard, generateBatchReport, runDriveRecommendations } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const PIE_COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

const STATS_COLORS = {
  emerald: { bg: 'bg-emerald-50 border border-emerald-100', text: 'text-emerald-700', glow: 'hover:neon-glow-green' },
  cyan: { bg: 'bg-cyan-50 border border-cyan-100', text: 'text-cyan-700', glow: 'hover:neon-glow-cyan' },
  amber: { bg: 'bg-amber-50 border border-amber-100', text: 'text-amber-700', glow: 'hover:neon-glow-amber' },
  purple: { bg: 'bg-purple-50 border border-purple-100', text: 'text-purple-700', glow: 'hover:neon-glow-purple' },
};

export default function TpoDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try { const { data: d } = await getTpoDashboard(); setData(d); }
    catch { addToast('Failed to load dashboard.', 'error'); }
    finally { setLoading(false); }
  };

  const handleBatchReport = async () => {
    setReportLoading(true);
    try { const { data: r } = await generateBatchReport(); setReport(r); addToast('Batch report generated!', 'success'); }
    catch { addToast('Failed to generate report.', 'error'); }
    finally { setReportLoading(false); }
  };

  const handleRunRecs = async () => {
    try { const { data: r } = await runDriveRecommendations(); addToast(`Sent ${r.sent} recommendation notifications!`, 'success'); }
    catch { addToast('Failed to run recommendations.', 'error'); }
  };

  if (loading) return <LoadingSpinner message="Loading TPO dashboard..." />;
  if (!data) return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-mesh">
      <div className="glass-card p-8 text-center max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to load data</h2>
        <p className="text-slate-500 mb-6">There was an issue fetching the dashboard information.</p>
        <button onClick={() => window.location.reload()} className="btn-primary w-full">Refresh Page</button>
      </div>
    </div>
  );

  const { stats, readiness, leaderboard, atRisk, skillHeatmap, drives } = data;
  const pieData = [
    { name: 'Ready (≥70%)', value: readiness.ready },
    { name: 'In Progress', value: readiness.inProgress },
    { name: 'Needs Attention', value: readiness.needsAttention },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-mesh">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/10">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">TPO Dashboard</h1>
              <p className="text-sm text-slate-500">{data.tpo?.college}</p>
            </div>
          </div>
          <Link to="/tpo/drives/new" className="px-5 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Post Drive
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Students', value: stats.totalStudents, color: 'emerald' },
            { icon: Briefcase, label: 'Active Drives', value: stats.activeDrives, color: 'cyan' },
            { icon: Trophy, label: 'Placed', value: stats.studentsPlaced, color: 'amber' },
            { icon: TrendingUp, label: 'Avg Score', value: `${stats.avgScore}%`, color: 'purple' },
          ].map((s, i) => {
            const sc = STATS_COLORS[s.color] || STATS_COLORS.emerald;
            return (
              <div key={i} className={`glass-card p-5 group ${sc.glow} shadow-sm`}>
                <div className={`w-10 h-10 rounded-xl ${sc.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <s.icon className={`w-5 h-5 ${sc.text}`} />
                </div>
                <p className={`text-3xl font-black ${sc.text}`}>{s.value}</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Drives */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Briefcase className="w-5 h-5 text-emerald-600" /> Drives</h2>
            {(drives || []).slice(0, 6).map(d => (
              <Link key={d._id} to={`/tpo/drives/${d._id}`} className="glass-card p-4 block hover:border-emerald-500/30 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-800">{d.companyName}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.status === 'upcoming' ? 'bg-emerald-50 text-emerald-700' : d.status === 'ongoing' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{d.status}</span>
                </div>
                <p className="text-xs text-slate-500">{d.jobRole} · {d.packageLPA} LPA · {d.applicants?.length || 0} applicants</p>
              </Link>
            ))}
            {(!drives || drives.length === 0) && <p className="text-sm text-slate-500">No drives posted yet.</p>}
          </div>

          {/* Center: Batch Intelligence */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-emerald-600" /> Batch Intelligence</h2>

            {/* Pie Chart */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Readiness Distribution</h3>
              <div className="h-48" style={{ minHeight: 192 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, color: '#1e293b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    {d.name}: {d.value}
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Top 10 Students</h3>
              <div className="space-y-2">
                {(leaderboard || []).map((s, i) => (
                  <Link key={s._id} to={`/tpo/students/${s._id}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all">
                    <span className="text-sm font-bold text-slate-500 w-6">{i + 1}</span>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center text-xs font-bold text-emerald-700">{s.name?.[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.branch} · CGPA {s.cgpa}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">{s.score}%</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button onClick={handleBatchReport} disabled={reportLoading} className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm">
                <Sparkles className="w-4 h-4" /> {reportLoading ? 'Generating...' : 'AI Batch Report'}
              </button>
              <button onClick={handleRunRecs} className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm">
                <Zap className="w-4 h-4" /> Run Recommendations
              </button>
            </div>
          </div>

          {/* Right: Skills + At Risk */}
          <div className="space-y-6">
            {/* Skill Heatmap */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Batch Skills</h3>
              <div className="h-64" style={{ minHeight: 256 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(skillHeatmap || []).slice(0, 8)} layout="vertical" margin={{ left: 60 }}>
                    <XAxis type="number" tick={{ fill: '#475569', fontSize: 11 }} />
                    <YAxis type="category" dataKey="skill" tick={{ fill: '#334155', fontSize: 11 }} width={55} />
                    <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, color: '#1e293b' }} />
                    <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* At Risk */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-600" /> At Risk (7+ days inactive)</h3>
              <div className="space-y-2">
                {(atRisk || []).slice(0, 5).map(s => (
                  <Link key={s._id} to={`/tpo/students/${s._id}`} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.branch} · Score: {s.score}%</p>
                    </div>
                    <span className="text-xs text-rose-600 font-semibold">{s.lastActive ? `${Math.floor((Date.now() - new Date(s.lastActive)) / 86400000)}d ago` : 'Never'}</span>
                  </Link>
                ))}
                {(!atRisk || atRisk.length === 0) && <p className="text-xs text-slate-500">No at-risk students</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Batch Report Modal */}
        {report && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setReport(null)}>
            <div className="glass-card-vibrant p-8 max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-600" /> AI Batch Report</h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">{report.report}</p>
              {report.keyInsights && (
                <div className="space-y-2 mb-4">
                  <h3 className="text-sm font-bold text-slate-600">Key Insights</h3>
                  {report.keyInsights.map((ins, i) => <p key={i} className="text-sm text-slate-600">• {ins}</p>)}
                </div>
              )}
              {report.recommendedFocus && <p className="text-sm text-emerald-700 font-bold">🎯 Focus: {report.recommendedFocus}</p>}
              <button onClick={() => setReport(null)} className="mt-6 btn-secondary w-full">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
