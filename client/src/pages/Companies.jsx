import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, TrendingUp, Shield, Star, Zap, ChevronDown, ChevronUp, ArrowRight, Search, Filter, Sparkles, Crown, CheckCircle, XCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { getCompanyMatches } from '../services/api';
import { useAuth } from '../context/AuthContext';

const COMPANY_COLORS = {
  'Google': { bg: 'from-blue-500 to-green-500', letter: 'G' },
  'Microsoft': { bg: 'from-blue-600 to-cyan-500', letter: 'M' },
  'Amazon': { bg: 'from-amber-500 to-orange-600', letter: 'A' },
  'TCS': { bg: 'from-indigo-600 to-blue-500', letter: 'T' },
  'Infosys': { bg: 'from-blue-500 to-indigo-600', letter: 'I' },
  'Wipro': { bg: 'from-purple-600 to-violet-500', letter: 'W' },
  'Flipkart': { bg: 'from-yellow-500 to-blue-600', letter: 'F' },
  'Razorpay': { bg: 'from-blue-600 to-indigo-700', letter: 'R' },
  'Zomato': { bg: 'from-red-500 to-rose-600', letter: 'Z' },
  'PhonePe': { bg: 'from-purple-600 to-indigo-600', letter: 'P' },
  'Accenture': { bg: 'from-violet-600 to-purple-500', letter: 'A' },
  'Deloitte': { bg: 'from-green-600 to-emerald-500', letter: 'D' },
  'Adobe': { bg: 'from-red-600 to-rose-500', letter: 'A' },
  'Paytm': { bg: 'from-cyan-500 to-blue-600', letter: 'P' },
  'CRED': { bg: 'from-slate-600 to-zinc-700', letter: 'C' },
};

const TYPE_CONFIG = {
  product: { label: 'Product', class: 'bg-emerald-50 text-emerald-700 border-emerald-200', emoji: '🚀' },
  service: { label: 'Service', class: 'bg-blue-50 text-blue-700 border-blue-200', emoji: '🏢' },
  startup: { label: 'Startup', class: 'bg-purple-50 text-purple-700 border-purple-200', emoji: '⚡' },
};

export default function Companies() {
  const { user } = useAuth();
  const studentId = user?.id || user?._id;
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (studentId) fetchData();
    else setLoading(false);
  }, [studentId]);

  const fetchData = async () => {
    try {
      const { data: result } = await getCompanyMatches(studentId);
      setData(result);
    } catch (error) {
      addToast('Failed to load company data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Scanning company requirements..." />;

  if (!studentId) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4 bg-mesh">
        <div className="text-center glass-card-vibrant p-14 max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Create your profile first</h2>
          <p className="text-slate-600 mb-8">We need to know your skills to calculate company match percentages.</p>
          <Link to="/setup" className="btn-primary inline-flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const getMatchStyle = (pct) => {
    if (pct >= 80) return { text: 'text-emerald-600', ring: 'stroke-emerald-500', glow: 'shadow-emerald-500/5', badge: 'bg-emerald-50 border-emerald-200', bar: 'from-emerald-500 to-emerald-400' };
    if (pct >= 50) return { text: 'text-amber-600', ring: 'stroke-amber-500', glow: 'shadow-amber-500/5', badge: 'bg-amber-50 border-amber-200', bar: 'from-amber-500 to-yellow-400' };
    return { text: 'text-rose-600', ring: 'stroke-rose-500', glow: 'shadow-rose-500/5', badge: 'bg-rose-50 border-rose-200', bar: 'from-rose-500 to-red-400' };
  };

  const filtered = (data?.companies || []).filter(c => {
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const readyCount = filtered.filter(c => c.matchPercent >= 75).length;
  const avgMatch = filtered.length > 0 ? Math.round(filtered.reduce((s, c) => s + c.matchPercent, 0) / filtered.length) : 0;
  const topCompany = filtered[0];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-mesh">
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="floating-orb w-[400px] h-[400px] -top-32 right-0 bg-indigo-600/10 animate-float" />
        <div className="floating-orb w-[350px] h-[350px] bottom-0 -left-20 bg-purple-600/8 animate-float-delay" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center animate-pulse-glow shadow-md shadow-indigo-500/10">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">Company Radar</h1>
              <p className="text-slate-500 text-sm">Your skills vs. what top companies want</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="glass-card p-5 text-center group hover:neon-glow-purple shadow-sm">
            <p className="text-3xl font-black gradient-text">{filtered.length}</p>
            <p className="text-xs text-slate-600 mt-1 font-medium">Companies</p>
          </div>
          <div className="glass-card p-5 text-center group hover:neon-glow-green shadow-sm">
            <p className="text-3xl font-black text-emerald-600">{readyCount}</p>
            <p className="text-xs text-slate-600 mt-1 font-medium">Ready ≥75%</p>
          </div>
          <div className="glass-card p-5 text-center group hover:neon-glow-amber shadow-sm">
            <p className="text-3xl font-black text-amber-600">{avgMatch}%</p>
            <p className="text-xs text-slate-600 mt-1 font-medium">Avg Match</p>
          </div>
          <div className="glass-card p-5 text-center group hover:neon-glow-cyan shadow-sm">
            <p className="text-3xl font-black text-indigo-600">{topCompany?.name || '—'}</p>
            <p className="text-xs text-slate-600 mt-1 font-medium">Best Match</p>
          </div>
        </div>

        {/* Boost Tip */}
        {data?.topBoostSkill && (
          <div className="glass-card-vibrant p-5 mb-8 flex items-center gap-4 animate-slide-up shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center flex-shrink-0 animate-bounce-soft shadow-lg shadow-amber-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 mb-0.5">💡 Pro Tip</p>
              <p className="text-sm text-slate-700">
                Learning <span className="font-bold text-amber-600">{data.topBoostSkill}</span> would boost your match across the most companies. Prioritize it!
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies..."
              className="input-field pl-11"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'product', 'service', 'startup'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-300 ${
                  filterType === type
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm'
                    : 'border border-slate-200 text-slate-600 hover:border-indigo-500/20 hover:text-indigo-600'
                }`}
              >
                {type === 'all' ? '✨ All' : `${TYPE_CONFIG[type]?.emoji || ''} ${type}`}
              </button>
            ))}
          </div>
        </div>

        {/* Company Cards */}
        <div className="space-y-4">
          {filtered.map((company, i) => {
            const style = getMatchStyle(company.matchPercent);
            const isExpanded = expandedId === company._id;
            const companyColor = COMPANY_COLORS[company.name] || { bg: 'from-slate-500 to-slate-600', letter: company.name[0] };
            const typeConf = TYPE_CONFIG[company.type] || TYPE_CONFIG.service;

            return (
              <div
                key={company._id}
                className={`glass-card overflow-hidden transition-all duration-400 hover:${style.glow}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : company._id)}
                  className="w-full p-5 sm:p-6 flex items-center gap-4 sm:gap-6 text-left hover:bg-white/[0.015] transition-all duration-300"
                >
                  {/* Company Logo */}
                  <div className={`company-logo bg-gradient-to-br ${companyColor.bg}`}>
                    {companyColor.letter}
                  </div>

                  {/* Match Ring */}
                  <div className="relative flex-shrink-0 hidden sm:block">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(99, 102, 241, 0.08)" strokeWidth="2.5" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        className={style.ring}
                        strokeWidth="2.5"
                        strokeDasharray={`${company.matchPercent} 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${style.text}`}>
                      {company.matchPercent}%
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-lg font-bold text-slate-800">{company.name}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${typeConf.class}`}>
                        {typeConf.label}
                      </span>
                      {company.matchPercent >= 80 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium flex items-center gap-1">
                          <Crown className="w-3 h-3" /> Ready
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {company.matchedSkills?.length}/{company.requiredSkills?.length} skills
                      </span>
                      <span>CGPA: {company.cgpaCutoff}+</span>
                      {/* Mobile match % */}
                      <span className={`sm:hidden font-bold ${style.text}`}>{company.matchPercent}% match</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="hidden md:block w-36 flex-shrink-0">
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700`}
                        style={{ width: `${company.matchPercent}%` }}
                      />
                    </div>
                  </div>

                  <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 border-t border-slate-200 pt-5 animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> Skills You Have
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {company.matchedSkills?.length > 0
                            ? company.matchedSkills.map(s => (
                              <span key={s} className="skill-tag skill-tag-green">{s}</span>
                            ))
                            : <span className="text-xs text-slate-500">None yet — start learning!</span>
                          }
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Skills to Learn
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {company.missingSkills?.length > 0
                            ? company.missingSkills.map(s => (
                              <span key={s} className="skill-tag skill-tag-red">{s}</span>
                            ))
                            : <span className="text-xs text-emerald-600 font-medium">🎉 All skills matched!</span>
                          }
                        </div>
                      </div>
                    </div>

                    {company.boostSkill && (
                      <div className="mt-5 p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                        <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 animate-bounce-soft" />
                        <p className="text-sm text-slate-700">
                          <span className="font-semibold text-amber-700">Boost tip:</span> Learning <span className="font-bold text-slate-800">{company.boostSkill}</span> would increase your match the most.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-slate-200 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500" /> CGPA: {company.cgpaCutoff}+
                        {company.cgpaEligible
                          ? <span className="text-emerald-600 font-medium">✓ Eligible</span>
                          : <span className="text-rose-600 font-medium">✗ Below</span>
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 glass-card">
            <Filter className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-lg text-slate-700 font-medium">No companies match your filters</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
