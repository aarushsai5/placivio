import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { registerStudent, loginStudent } from '../../services/api';

export default function StudentAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = isLogin ? await loginStudent(form) : await registerStudent(form);
      login(data.token, data.user);
      addToast(isLogin ? 'Welcome back! 🎉' : 'Account created! Let\'s set up your profile.', 'success');
      navigate(data.user.profileCompleted ? `/dashboard/${data.user.id}` : '/setup');
    } catch (error) {
      addToast(error.response?.data?.error || 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-mesh relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-[400px] h-[400px] -top-32 -left-20 bg-indigo-600/15 animate-float" />
        <div className="floating-orb w-[350px] h-[350px] bottom-0 right-0 bg-purple-600/10 animate-float-delay" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black gradient-text">Placivio</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{isLogin ? 'Welcome Back' : 'Join Placivio'}</h1>
          <p className="text-slate-600">
            {isLogin ? 'Sign in to continue your placement journey' : 'Create your account and get started'}
          </p>
        </div>

        <div className="glass-card-vibrant p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Aarush Sai" className="input-field pl-11" required={!isLogin} />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@college.edu" className="input-field pl-11" required />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="input-field pl-11 pr-11" required minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
              {loading ? <span className="flex gap-1"><span className="w-2 h-2 rounded-full bg-white animate-bounce" /><span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.15s' }} /><span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.3s' }} /></span>
                : <>{isLogin ? 'Sign In' : 'Create Account'}<ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="font-semibold text-indigo-600">{isLogin ? 'Sign Up' : 'Sign In'}</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-slate-600">
          <Link to="/auth/tpo" className="text-indigo-600/60 hover:text-indigo-600 transition-colors">I'm a TPO →</Link>
        </p>
      </div>
    </div>
  );
}
