import { useState, useEffect } from 'react';
import { Building2, Calendar, Clock, MapPin, Briefcase, DollarSign, ChevronDown, Search, Filter, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getDrivesForCollege, applyToDrive, getStudentApplications } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Drives() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [drives, setDrives] = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [drivesRes, appsRes] = await Promise.all([
        getDrivesForCollege(user.college),
        getStudentApplications(user.id || user._id),
      ]);
      // Calculate match % for each drive
      const studentSkills = (user.skills || []).map(s => s.toLowerCase().trim());
      const withMatch = drivesRes.data.map(d => {
        const matched = (d.requiredSkills || []).filter(rs => studentSkills.some(ss => ss.includes(rs.toLowerCase().trim()) || rs.toLowerCase().trim().includes(ss)));
        const matchPct = d.requiredSkills?.length > 0 ? Math.round((matched.length / d.requiredSkills.length) * 10) * 10 : 100;
        return { ...d, matchPercent: matchPct, matchedSkills: matched };
      });
      // Sort: open first, then by match
      withMatch.sort((a, b) => {
        const statusOrder = { upcoming: 0, ongoing: 1, completed: 2 };
        const sa = statusOrder[a.status] ?? 1; const sb = statusOrder[b.status] ?? 1;
        if (sa !== sb) return sa - sb;
        return b.matchPercent - a.matchPercent;
      });
      setDrives(withMatch);
      setAppliedIds(new Set(appsRes.data.map(a => a.driveId?._id || a.driveId)));
    } catch { addToast('Failed to load drives.', 'error'); }
    finally { setLoading(false); }
  };

  const handleApply = async (driveId) => {
    setApplying(driveId);
    try {
      await applyToDrive(driveId);
      setAppliedIds(prev => new Set([...prev, driveId]));
      addToast('Application submitted! TPO has been notified. 🎉', 'success');
    } catch (error) {
      addToast(error.response?.data?.error || 'Failed to apply.', 'error');
    } finally { setApplying(null); }
  };

  if (loading) return <LoadingSpinner message="Loading campus drives..." />;

  const filtered = drives.filter(d => {
    if (filter === 'open' && d.status === 'completed') return false;
    if (filter === 'applied' && !appliedIds.has(d._id)) return false;
    if (search && !d.companyName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getMatchColor = (pct) => {
    if (pct >= 70) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'from-emerald-500 to-emerald-400' };
    if (pct >= 50) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'from-amber-500 to-yellow-400' };
    return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'from-rose-500 to-red-400' };
  };

  const getStatusBadge = (d) => {
    const now = new Date();
    const deadline = new Date(d.registrationDeadline);
    if (d.status === 'completed') return { text: 'Closed', class: 'bg-slate-100 text-slate-600 border-slate-200' };
    const daysLeft = Math.ceil((deadline - now) / 86400000);
    if (daysLeft <= 3 && daysLeft > 0) return { text: `Closing in ${daysLeft}d`, class: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' };
    if (daysLeft <= 0) return { text: 'Closed', class: 'bg-slate-100 text-slate-600 border-slate-200' };
    return { text: 'Open', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-mesh">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/10">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Campus Drives</h1>
            <p className="text-sm text-slate-500">{user.college} · {filtered.length} drives</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..." className="input-field pl-11" />
          </div>
          <div className="flex gap-2">
            {[['all', '✨ All'], ['open', '🟢 Open'], ['applied', '📋 Applied']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === val ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm' : 'border border-slate-200 text-slate-600 hover:border-indigo-500/20 hover:text-indigo-600'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Drive Cards */}
        <div className="space-y-4">
          {filtered.map(drive => {
            const mc = getMatchColor(drive.matchPercent);
            const status = getStatusBadge(drive);
            const isApplied = appliedIds.has(drive._id);
            const isExpanded = expandedId === drive._id;
            const cgpaOk = (user.cgpa || 0) >= drive.cgpaCutoff;
            const branchOk = !drive.branchesAllowed || drive.branchesAllowed.length === 0 || drive.branchesAllowed.includes(user.branch);
            const eligible = cgpaOk && branchOk && status.text !== 'Closed';
            const daysToDate = Math.ceil((new Date(drive.driveDate) - new Date()) / 86400000);

            return (
              <div key={drive._id} className="glass-card overflow-hidden">
                <button onClick={() => setExpandedId(isExpanded ? null : drive._id)} className="w-full p-5 flex items-center gap-5 text-left hover:bg-white/[0.015] transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0 shadow-md">
                    {drive.companyName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-800">{drive.companyName}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${status.class}`}>{status.text}</span>
                      {isApplied && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">Applied ✓</span>}
                    </div>
                    <p className="text-sm text-slate-600">{drive.jobRole} · {drive.packageLPA} LPA · {daysToDate > 0 ? `in ${daysToDate} days` : 'date passed'}</p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <span className={`text-2xl font-black ${mc.text}`}>{drive.matchPercent}%</span>
                    <span className="text-xs text-slate-600">{drive.matchPercent >= 70 ? '🎯 Ready!' : drive.matchPercent >= 50 ? '⚡ Almost!' : '📚 Skill up'}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-200 pt-4 animate-fade-in space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-600"><Calendar className="w-4 h-4" /> Drive: {new Date(drive.driveDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="flex items-center gap-2 text-slate-600"><Clock className="w-4 h-4" /> Deadline: {new Date(drive.registrationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="flex items-center gap-2 text-slate-600"><DollarSign className="w-4 h-4" /> Package: {drive.packageLPA} LPA</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-slate-600">CGPA: {drive.cgpaCutoff}+ {cgpaOk ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-rose-600 font-bold">✗ ({user.cgpa})</span>}</div>
                        <div className="text-slate-600">Branches: {drive.branchesAllowed?.join(', ') || 'All'} {branchOk ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-rose-600 font-bold">✗</span>}</div>
                        <div className="text-slate-600">Seats: {drive.seatsAvailable || 'N/A'} · {drive.driveType}</div>
                      </div>
                    </div>
                    {drive.requiredSkills?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {drive.requiredSkills.map(s => {
                            const has = (user.skills || []).some(us => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()));
                            return <span key={s} className={`skill-tag ${has ? 'skill-tag-green' : 'skill-tag-red'}`}>{s}</span>;
                          })}
                        </div>
                      </div>
                    )}
                    {drive.description && <p className="text-sm text-slate-600 leading-relaxed">{drive.description}</p>}

                    {!isApplied ? (
                      <button onClick={() => handleApply(drive._id)} disabled={!eligible || applying === drive._id}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                        {applying === drive._id ? 'Applying...' : !eligible ? (status.text === 'Closed' ? 'Registration Closed' : 'Not Eligible') : 'Apply Now 🚀'}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" /> Application Submitted
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 glass-card"><AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" /><p className="text-lg text-slate-700">No drives found</p></div>
        )}
      </div>
    </div>
  );
}
