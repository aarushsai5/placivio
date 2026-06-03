import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Target, BookOpen, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useToast } from '../../context/ToastContext';
import { getTpoDashboard, generateBatchReport } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const PIE_COLORS = ['#34d399', '#fbbf24', '#fb7185'];
const BRANCH_COLORS = ['#818cf8', '#c084fc', '#f472b6', '#38bdf8', '#fbbf24', '#34d399'];

export default function BatchAnalytics() {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try { const { data: d } = await getTpoDashboard(); setData(d); }
    catch { addToast('Failed to load analytics.', 'error'); }
    finally { setLoading(false); }
  };

  const handleBatchReport = async () => {
    setReportLoading(true);
    try { const { data: r } = await generateBatchReport(); setReport(r); addToast('Batch report generated!', 'success'); }
    catch { addToast('Failed to generate report.', 'error'); }
    finally { setReportLoading(false); }
  };

  if (loading) return <LoadingSpinner message="Loading batch analytics..." />;
  if (!data) return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-mesh">
      <div className="glass-card p-8 text-center max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to load data</h2>
        <p className="text-slate-500 mb-6">There was an issue fetching batch analytics.</p>
        <button onClick={() => window.location.reload()} className="btn-primary w-full">Refresh Page</button>
      </div>
    </div>
  );

  const { stats, readiness, leaderboard, atRisk, skillHeatmap } = data;
  const pieData = [
    { name: 'Ready (≥70%)', value: readiness.ready },
    { name: 'In Progress', value: readiness.inProgress },
    { name: 'Needs Attention', value: readiness.needsAttention },
  ].filter(d => d.value > 0);

  // Group leaderboard/atRisk by branch for a simple branch chart (mock data structure for chart)
  const branchCounts = {};
  [...(leaderboard || []), ...(atRisk || [])].forEach(s => {
    branchCounts[s.branch] = (branchCounts[s.branch] || 0) + 1;
  });
  const branchData = Object.entries(branchCounts).map(([name, value]) => ({ name, value })).slice(0, 6);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-mesh">
      <div className="max-w-7xl mx-auto relative z-10">
        <Link to="/tpo/dashboard" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/10">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">Batch Analytics</h1>
              <p className="text-sm text-slate-500">Deep dive into your students' performance</p>
            </div>
          </div>
          <button onClick={handleBatchReport} disabled={reportLoading} className="px-5 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> {reportLoading ? 'Generating...' : 'AI Batch Report'}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Readiness Pie Chart */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-slate-400" /> Readiness Distribution</h3>
            <div className="h-64" style={{ minHeight: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3} label>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, color: '#1e293b' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#475569' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Heatmap Bar Chart */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-slate-400" /> Most Common Skills</h3>
            <div className="h-64" style={{ minHeight: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(skillHeatmap || []).slice(0, 10)}>
                  <XAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 11 }} interval={0} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, color: '#1e293b' }} cursor={{ fill: 'rgba(99,102,241,0.02)' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Branch Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Branch Distribution</h3>
            <div className="h-64" style={{ minHeight: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={branchData.length > 0 ? branchData : [{name: 'CSE', value: 1}]} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={2} label>
                    {(branchData.length > 0 ? branchData : [{name: 'CSE', value: 1}]).map((_, i) => <Cell key={i} fill={BRANCH_COLORS[i % BRANCH_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, color: '#1e293b' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#475569' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* At Risk List */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-600" /> At Risk Students</h3>
            <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
              {(atRisk || []).map(s => (
                <div key={s._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-xs font-bold text-rose-700">{s.name?.[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.branch} · Sem {s.semester}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-rose-600">Score: {s.score}%</p>
                    <p className="text-xs text-slate-500">{s.lastActive ? `${Math.floor((Date.now() - new Date(s.lastActive)) / 86400000)}d inactive` : 'Never active'}</p>
                  </div>
                </div>
              ))}
              {(!atRisk || atRisk.length === 0) && (
                <div className="text-center py-8"><p className="text-slate-500 text-sm">No at-risk students right now.</p></div>
              )}
            </div>
          </div>
        </div>

        {/* AI Report Modal */}
        {report && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setReport(null)}>
            <div className="glass-card p-8 max-w-2xl w-full max-h-[80vh] overflow-auto border border-emerald-500/10" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-600" /> Comprehensive Batch Report</h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mb-6">{report.report}</p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {report.keyInsights && (
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <h3 className="text-sm font-bold text-indigo-800 mb-2">Key Insights</h3>
                    <ul className="space-y-1.5">
                      {report.keyInsights.map((ins, i) => <li key={i} className="text-xs text-slate-600">• {ins}</li>)}
                    </ul>
                  </div>
                )}
                {report.recommendedFocus && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <h3 className="text-sm font-bold text-emerald-800 mb-2">Actionable Focus</h3>
                    <p className="text-sm text-slate-700 font-semibold">{report.recommendedFocus}</p>
                  </div>
                )}
              </div>
              
              <button onClick={() => setReport(null)} className="btn-secondary w-full">Close Report</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
