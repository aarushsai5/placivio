import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Brain, Target, TrendingUp, Zap, BarChart3, Users, Rocket, Star, Shield, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function FloatingParticles() {
  return (
    <div className="floating-particles">
      {/* Large gradient orbs */}
      <div className="floating-orb w-[500px] h-[500px] -top-40 -left-40 bg-indigo-500/10 animate-float" />
      <div className="floating-orb w-[600px] h-[600px] -bottom-60 -right-40 bg-purple-500/8 animate-float-delay" />
      <div className="floating-orb w-[350px] h-[350px] top-1/3 right-1/4 bg-cyan-400/8 animate-float-slow" />
      <div className="floating-orb w-[300px] h-[300px] bottom-1/4 left-1/3 bg-pink-400/6 animate-float" />

      {/* Small flying particles */}
      <div className="particle w-2 h-2 bg-indigo-500/50 top-[15%] left-[10%] animate-particle-1" />
      <div className="particle w-3 h-3 bg-purple-500/40 top-[25%] right-[15%] animate-particle-2" />
      <div className="particle w-1.5 h-1.5 bg-cyan-500/60 top-[60%] left-[20%] animate-particle-3" />
      <div className="particle w-2.5 h-2.5 bg-pink-500/40 top-[40%] right-[25%] animate-particle-4" />
      <div className="particle w-2 h-2 bg-amber-500/50 top-[75%] left-[60%] animate-particle-5" />
      <div className="particle w-1.5 h-1.5 bg-emerald-500/50 top-[85%] left-[80%] animate-particle-1" />
      <div className="particle w-3 h-3 bg-indigo-400/30 top-[10%] left-[70%] animate-particle-3" />
      <div className="particle w-2 h-2 bg-rose-500/40 top-[50%] left-[85%] animate-particle-2" />

      {/* Floating shapes */}
      <div className="absolute top-[20%] right-[10%] w-8 h-8 border-2 border-indigo-500/30 rounded-lg animate-float rotate-45" />
      <div className="absolute top-[60%] left-[5%] w-6 h-6 border-2 border-purple-500/30 rounded-full animate-float-delay" />
      <div className="absolute top-[80%] right-[20%] w-10 h-10 border-2 border-cyan-500/25 rounded-xl animate-float-slow rotate-12" />
      <div className="absolute top-[30%] left-[35%] w-4 h-4 bg-pink-500/15 rounded-full animate-particle-4" />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color, delay = '' }) {
  const colorMap = {
    cyan: {
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
      iconColor: 'text-cyan-400',
      glow: 'group-hover:shadow-cyan-500/10',
    },
    pink: {
      iconBg: 'bg-pink-500/10 border-pink-500/20',
      iconColor: 'text-pink-400',
      glow: 'group-hover:shadow-pink-500/10',
    },
    purple: {
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      iconColor: 'text-purple-400',
      glow: 'group-hover:shadow-purple-500/10',
    },
    amber: {
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-400',
      glow: 'group-hover:shadow-amber-500/10',
    },
    green: {
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-400',
      glow: 'group-hover:shadow-emerald-500/10',
    },
    blue: {
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-400',
      glow: 'group-hover:shadow-blue-500/10',
    },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className={`group glass-card p-7 ${delay} hover:shadow-xl ${c.glow} transition-all duration-400`}>
      <div className={`w-14 h-14 rounded-2xl ${c.iconBg} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-7 h-7 ${c.iconColor}`} />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:gradient-text transition-all">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { user, isStudent, isTpo, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isStudent) {
      const sid = user?.id || user?._id;
      if (sid && user?.profileCompleted) navigate(`/dashboard/${sid}`);
      else if (sid) navigate('/setup');
    } else if (isAuthenticated && isTpo) {
      navigate('/tpo/dashboard');
    }
  }, [isAuthenticated, isStudent, isTpo, user, navigate]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen relative bg-mesh overflow-hidden">
      <FloatingParticles />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-600">AI-Powered Placement Agent for India</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 animate-slide-up leading-[1.1] tracking-tight">
            <span className="text-slate-900">Your AI</span>
            <br />
            <span className="gradient-text">Placement Coach</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up-delay">
            Placivio analyzes your skills, finds the gaps, builds your{' '}
            <span className="text-indigo-600 font-semibold">personalized roadmap</span>, and tracks you 
            until you're <span className="text-emerald-600 font-semibold">placement-ready</span>. 
            Powered by <span className="text-amber-600 font-semibold">Google Gemini AI</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-2">
            <Link
              to="/auth/student"
              className="btn-primary text-lg flex items-center gap-3 group"
            >
              <Rocket className="w-5 h-5 group-hover:animate-bounce-soft" />
              I'm a Student
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/auth/tpo"
              className="px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3"
            >
              <Building2 className="w-5 h-5" />
              I'm a TPO
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <span className="text-sm text-slate-600">15+ companies tracked</span>
            <span className="text-slate-400">|</span>
            <span className="text-sm text-slate-600">AI-powered analysis</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-slate-900">How </span>
              <span className="gradient-text-cool">Placivio</span>
              <span className="text-slate-900"> Works</span>
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto">Not a chatbot. A persistent AI agent that evolves your plan every session.</p>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              { step: '01', title: 'Share Your Profile', desc: 'Skills, CGPA, branch, target companies', color: 'from-cyan-500 to-blue-500', icon: Users },
              { step: '02', title: 'AI Analyzes Gaps', desc: 'Gemini compares you vs. company requirements', color: 'from-purple-500 to-pink-500', icon: Brain },
              { step: '03', title: 'Follow & Level Up', desc: 'Weekly roadmap, check-ins, live score updates', color: 'from-amber-500 to-rose-500', icon: TrendingUp },
            ].map((item, i) => (
              <div key={i} className="glass-card-vibrant p-7 text-center group">
                <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-xs font-bold text-slate-600 tracking-[0.2em] uppercase mb-2">Step {item.step}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-slate-900">Everything You Need to </span>
              <span className="gradient-text-warm">Get Placed</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard icon={Brain} title="AI Skill Analysis" description="Gemini AI compares your skills vs what Google, Microsoft, TCS actually want." color="cyan" />
            <FeatureCard icon={Target} title="Smart Roadmap" description="Week-by-week learning plan with free YouTube, docs, and course resources." color="pink" />
            <FeatureCard icon={BarChart3} title="Live Score" description="Dynamic placement readiness score that evolves as you learn and grow." color="purple" />
            <FeatureCard icon={Zap} title="Company Radar" description="See your match % for 15+ companies. Green means you're ready." color="amber" />
            <FeatureCard icon={Shield} title="Smart Alerts" description="Proactive notifications when you're close to a company match or falling behind." color="green" />
            <FeatureCard icon={Sparkles} title="AI Coach Chat" description="Ask your personal placement coach anything — it knows your entire history." color="blue" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card-vibrant p-10 sm:p-14 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Ready to <span className="gradient-text">Get Placed?</span>
            </h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              Join thousands of Indian engineering students using AI to land their dream placement.
            </p>
            <Link to="/auth/student" className="btn-glow text-lg inline-flex items-center gap-3 group">
              <Sparkles className="w-5 h-5" />
              Start My Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-slate-200 text-center">
        <p className="text-sm text-slate-500">
          Built with 💜 for Indian Engineering Students · Powered by Google Gemini AI
        </p>
      </footer>
    </div>
  );
}

