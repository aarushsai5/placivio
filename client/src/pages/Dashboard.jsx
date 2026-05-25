import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Target, Clock, ClipboardCheck, Sparkles, ArrowRight, Building2, Zap, TrendingUp, Crown, Rocket } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import WeekAccordion from '../components/WeekAccordion';
import ChatWidget from '../components/ChatWidget';
import AlertsPanel from '../components/AlertsPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { getDashboard, completeWeek, markAllAlertsRead } from '../services/api';

function HeroScore({ score = 0 }) {
  const getColor = (s) => {
    if (s < 40) return { color: '#fb7185', label: 'Needs Work', emoji: '🔥' };
    if (s <= 70) return { color: '#fbbf24', label: 'Getting There', emoji: '⚡' };
    return { color: '#34d399', label: 'Looking Strong', emoji: '🚀' };
  };
  const { color, label, emoji } = getColor(score);
  const data = [{ value: score, fill: color }];

  return (
    <div className="relative">
      <div className="relative w-52 h-52 mx-auto" style={{ minWidth: 208, minHeight: 208 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="72%" outerRadius="100%" startAngle={90} endAngle={-270} data={data} barSize={14}>
            <RadialBar background={{ fill: 'rgba(14, 165, 233, 0.1)' }} dataKey="value" cornerRadius={10} max={100} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black" style={{ color }}>{score}</span>
          <span className="text-xs text-slate-600 mt-1 font-bold uppercase tracking-wider">{label}</span>
        </div>
      </div>
      <div className="text-center mt-3">
        <span className="text-sm font-semibold text-slate-600">{emoji} Placement Readiness</span>
      </div>
    </div>
  );
}

function CompanyMatchMini({ company, rank }) {
  const getBar = (pct) => {
    if (pct >= 80) return { bar: 'from-emerald-400 to-emerald-500', text: 'text-emerald-600' };
    if (pct >= 50) return { bar: 'from-amber-400 to-orange-500', text: 'text-amber-600' };
    return { bar: 'from-rose-400 to-rose-500', text: 'text-rose-600' };
  };
  const style = getBar(company.matchPercent);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="p-4 rounded-2xl bg-white/60 border border-slate-200/60 hover:border-sky-500/40 transition-all duration-300 hover:translate-y-[-2px] group shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{medals[rank] || ''}</span>
          <span className="text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-all">{company.name}</span>
        </div>
        <span className={`text-sm font-black ${style.text}`}>{company.matchPercent}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200/80 overflow-hidden mb-2.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700 ease-out`}
          style={{ width: `${company.matchPercent}%` }}
        />
      </div>
      {company.boostSkill && (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Learn <span className="text-amber-600 font-bold">{company.boostSkill}</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { studentId } = useParams();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openWeek, setOpenWeek] = useState(null);

  useEffect(() => { fetchDashboard(); }, [studentId]);

  const fetchDashboard = async () => {
    try {
      const { data: d } = await getDashboard(studentId);
      setData(d);
      if (d.roadmap?.weeks) {
        const first = d.roadmap.weeks.find(w => !w.completed);
        if (first) setOpenWeek(first.weekNumber);
      }
    } catch { addToast('Failed to load dashboard.', 'error'); }
    finally { setLoading(false); }
  };

  const handleCompleteWeek = async (wn) => {
    try { await completeWeek(studentId, wn); addToast(`Week ${wn} complete! 🎉`, 'success'); fetchDashboard(); }
    catch { addToast('Failed to update week.', 'error'); }
  };

  const handleMarkAllRead = async () => {
    try { await markAllAlertsRead(studentId); fetchDashboard(); } catch {}
  };

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;
  if (!data?.student) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center glass-card p-12">
          <p className="text-xl font-semibold text-slate-700 mb-4">Student not found</p>
          <Link to="/setup" className="btn-primary">Create Profile</Link>
        </div>
      </div>
    );
  }

  const { student, roadmap, progress, alerts, topCompanies } = data;
  const completedWeeks = roadmap?.weeks?.filter(w => w.completed).length || 0;
  const totalWeeks = roadmap?.totalWeeks || 0;

  const skillsLearned = new Set();
  (roadmap?.weeks || []).filter(w => w.completed).forEach(w => (w.skills || []).forEach(s => skillsLearned.add(s)));
  (progress || []).forEach(p => (p.skillsLearned || []).forEach(s => skillsLearned.add(s)));

  const skillGapsRemaining = (roadmap?.skillGaps || []).filter(
    g => !student.skills.includes(g) && !skillsLearned.has(g)
  );

  const now = new Date();
  let pDate = new Date(now.getFullYear(), 11, 1);
  if (now > pDate) pDate = new Date(now.getFullYear() + 1, 11, 1);
  const daysLeft = Math.ceil((pDate - now) / (1000 * 60 * 60 * 24));

  const unreadAlerts = (alerts || []).filter(a => !a.isRead);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-mesh">
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="floating-orb w-[500px] h-[500px] -top-40 -left-40 bg-sky-400/10 animate-float" />
        <div className="floating-orb w-[400px] h-[400px] bottom-0 right-0 bg-orange-400/10 animate-float-delay" />
        <div className="floating-orb w-[300px] h-[300px] top-1/2 left-1/2 bg-cyan-300/10 animate-float-slow" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Hero — Welcome + Score + Companies */}
        <div className="glass-card-vibrant p-8 sm:p-10 mb-8 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-sky-500/30">
                  {student.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
                    Hey, {student.name.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-sm font-semibold text-slate-600">
                    {student.college} · {student.branch} · Sem {student.semester}
                  </p>
                </div>
              </div>
              <HeroScore score={student.placementScore || roadmap?.placementScore || 0} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-500" /> Top Matches
                </h3>
                <Link to="/companies" className="text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {(topCompanies || []).map((c, i) => <CompanyMatchMini key={i} company={c} rank={i} />)}
                {(!topCompanies || topCompanies.length === 0) && (
                  <p className="text-sm font-semibold text-slate-600 text-center py-6">Generate your roadmap to see company matches</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <StatCard icon={BookOpen} label="Skills Learned" value={skillsLearned.size} color="primary" />
          <StatCard icon={CheckCircle} label="Weeks Done" value={`${completedWeeks}/${totalWeeks}`} color="green" />
          <StatCard icon={Target} label="Skills Left" value={skillGapsRemaining.length} color="accent" />
          <StatCard icon={Clock} label="Days Left" value={daysLeft} color="yellow" />
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left — Roadmap */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" /> Your Roadmap
              </h2>
              <Link to={`/checkin/${studentId}`} className="btn-secondary text-sm flex items-center gap-2 py-2 px-4 shadow-sm hover:shadow-md">
                <ClipboardCheck className="w-4 h-4" /> Check-in
              </Link>
            </div>

            {roadmap?.weeks?.map((week) => (
              <WeekAccordion
                key={week.weekNumber}
                week={week}
                isOpen={openWeek === week.weekNumber}
                onToggle={() => setOpenWeek(openWeek === week.weekNumber ? null : week.weekNumber)}
                onComplete={handleCompleteWeek}
                isCurrent={roadmap.weeks.find(w => !w.completed)?.weekNumber === week.weekNumber}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">Skill Map</h3>
              {student.skills?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-emerald-600 font-bold mb-2 flex items-center gap-1">✅ Your Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {student.skills.map(s => <span key={s} className="skill-tag skill-tag-green">{s}</span>)}
                  </div>
                </div>
              )}
              {skillGapsRemaining.length > 0 && (
                <div>
                  <p className="text-xs text-rose-600 font-bold mb-2 flex items-center gap-1">🎯 To Learn</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGapsRemaining.map(s => <span key={s} className="skill-tag skill-tag-red">{s}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {roadmap?.immediateActions?.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-orange-500" /> Do Today
                </h3>
                <div className="space-y-2.5">
                  {roadmap.immediateActions.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-slate-200/60 hover:border-sky-500/40 transition-all shadow-sm hover:shadow-md">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-800 leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ChatWidget studentId={studentId} />

            {/* Alerts */}
            {alerts?.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">🔔 Alerts</h3>
                  {unreadAlerts.length > 0 && (
                     <button onClick={handleMarkAllRead} className="text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors">
                      Mark all read
                    </button>
                  )}
                </div>
                <AlertsPanel alerts={unreadAlerts.length > 0 ? unreadAlerts : (alerts || []).slice(0, 5)} />
              </div>
            )}

            {roadmap?.encouragement && (
              <div className="glass-card-vibrant p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5 animate-bounce-soft" />
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed italic">"{roadmap.encouragement}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
