import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building2, ArrowRight, Sparkles, Eye, EyeOff, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { registerTpo, loginTpo } from '../../services/api';

export default function TpoAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', designation: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = isLogin ? await loginTpo(form) : await registerTpo(form);
      login(data.token, data.user);
      addToast(isLogin ? 'Welcome back, TPO! 🎓' : 'TPO account created!', 'success');
      navigate('/tpo/dashboard');
    } catch (error) {
      addToast(error.response?.data?.error || 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-mesh relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-[400px] h-[400px] -top-32 right-0 bg-emerald-600/15 animate-float" />
        <div className="floating-orb w-[350px] h-[350px] bottom-0 -left-20 bg-teal-600/10 animate-float-delay" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Placivio TPO</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{isLogin ? 'TPO Login' : 'Register as TPO'}</h1>
          <p className="text-slate-400">{isLogin ? 'Manage your campus placements' : 'Set up your placement office'}</p>
        </div>

        <div className="glass-card-vibrant p-8" style={{ borderColor: 'rgba(52, 211, 153, 0.12)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Dr. Sharma" className="input-field pl-11" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">College</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })}
                      placeholder="GGITS Jabalpur" className="input-field pl-11" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Designation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })}
                      placeholder="Training & Placement Officer" className="input-field pl-11" />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="tpo@college.edu" className="input-field pl-11" required />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="input-field pl-11 pr-11" required minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6">
              {loading ? <span className="flex gap-1"><span className="w-2 h-2 rounded-full bg-white animate-bounce" /><span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.15s' }} /><span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.3s' }} /></span>
                : <>{isLogin ? 'Sign In' : 'Create TPO Account'}<ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="font-semibold text-emerald-400">{isLogin ? 'Register' : 'Sign In'}</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-slate-600">
          <Link to="/auth/student" className="text-emerald-400/60 hover:text-emerald-400 transition-colors">← I'm a Student</Link>
        </p>
      </div>
    </div>
  );
}
