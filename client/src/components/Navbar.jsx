import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, ClipboardCheck, Building2, LogOut, Bell, Sparkles, Briefcase, BarChart3, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUnreadCount } from '../services/api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isStudent, isTpo, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userId = user?.id || user?._id;

  useEffect(() => {
    if (userId) {
      getUnreadCount(userId).then(({ data }) => setUnreadCount(data.count || 0)).catch(() => {});
    }
  }, [userId, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const studentLinks = userId ? [
    { to: `/dashboard/${userId}`, label: 'Dashboard', icon: LayoutDashboard, active: isActive('/dashboard') },
    { to: '/drives', label: 'Drives', icon: Briefcase, active: isActive('/drives') },
    { to: '/companies', label: 'Companies', icon: Building2, active: isActive('/companies') },
    { to: `/checkin/${userId}`, label: 'Check-in', icon: ClipboardCheck, active: isActive('/checkin') },
  ] : [];

  const tpoLinks = [
    { to: '/tpo/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: isActive('/tpo/dashboard') },
    { to: '/tpo/drives/new', label: 'Post Drive', icon: Plus, active: isActive('/tpo/drives/new') },
    { to: '/tpo/analytics', label: 'Analytics', icon: BarChart3, active: isActive('/tpo/analytics') },
  ];

  const navLinks = isTpo ? tpoLinks : isStudent ? studentLinks : [];
  const accentGradient = isTpo ? 'from-emerald-500 to-teal-600' : 'from-indigo-500 via-purple-500 to-pink-500';
  const accentBorder = isTpo ? 'border-emerald-500/20' : 'border-indigo-500/20';
  const accentBg = isTpo ? 'from-emerald-500/15 to-teal-500/15' : 'from-indigo-500/15 to-purple-500/15';
  const accentShadow = isTpo ? 'shadow-emerald-500/20' : 'shadow-indigo-500/20';

  if (!isAuthenticated) {
    // Landing-only minimal nav
    return (
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card !rounded-none sm:!rounded-b-2xl !border-t-0 px-4 sm:px-6" style={{ borderRadius: '0 0 16px 16px' }}>
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accentGradient} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-xl font-black gradient-text">Placivio</span>
              </Link>
              <div className="flex items-center gap-3">
                <Link to="/auth/student" className="btn-primary text-sm px-5 py-2">Student Login</Link>
                <Link to="/auth/tpo" className="btn-secondary text-sm px-5 py-2">TPO Login</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const userName = user?.name?.split(' ')[0] || '';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card !rounded-none sm:!rounded-b-2xl !border-t-0 px-4 sm:px-6" style={{ borderRadius: '0 0 16px 16px' }}>
          <div className="flex items-center justify-between h-16">
            <Link to={isTpo ? '/tpo/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accentGradient} flex items-center justify-center group-hover:scale-105 transition-transform group-hover:shadow-lg ${accentShadow}`}>
                {isTpo ? <Building2 className="w-4.5 h-4.5 text-white" /> : <Sparkles className="w-4.5 h-4.5 text-white" />}
              </div>
              <span className={`text-xl font-black ${isTpo ? 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400' : 'gradient-text'}`}>
                Placivio{isTpo ? ' TPO' : ''}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${link.active ? `bg-gradient-to-r ${accentBg} ${isTpo ? 'text-emerald-700 border-emerald-500/20' : 'text-indigo-600 border-indigo-500/20'} border` : `text-slate-600 ${isTpo ? 'hover:text-emerald-700 hover:bg-emerald-50/50' : 'hover:text-indigo-600 hover:bg-indigo-50/50'}`}`}>
                  <link.icon className="w-4 h-4" /> {link.label}
                </Link>
              ))}

              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
                <Link to={isStudent ? '/notifications' : '/tpo/dashboard'} className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] text-white font-bold flex items-center justify-center animate-pulse shadow-lg shadow-rose-500/30">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {userName && (
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/60">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${accentGradient} flex items-center justify-center shadow-lg ${accentShadow}`}>
                      <span className="text-xs font-bold text-white">{userName[0]?.toUpperCase()}</span>
                    </div>
                    <span className="text-sm text-slate-700 font-semibold">{userName}</span>
                  </div>
                )}

                <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-rose-600 transition-colors hover:bg-rose-500/5 rounded-lg" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              {unreadCount > 0 && (
                <Link to={isStudent ? '/notifications' : '/tpo/dashboard'} className="relative p-2 text-slate-600">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] text-white font-bold flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
                </Link>
              )}
              <button className="text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden pb-4 animate-fade-in border-t border-slate-200 mt-1">
              {userName && (
                <div className="flex items-center gap-3 py-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${accentGradient} flex items-center justify-center`}>
                    <span className="text-sm font-bold text-white">{userName[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-slate-700 font-semibold">{userName} {isTpo ? '(TPO)' : ''}</span>
                </div>
              )}
              <div className="flex flex-col gap-1 pt-1">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${link.active ? `bg-gradient-to-r ${accentBg} ${isTpo ? 'text-emerald-700' : 'text-indigo-600'}` : `text-slate-600 ${isTpo ? 'hover:text-emerald-700 hover:bg-emerald-50/50' : 'hover:text-indigo-600 hover:bg-indigo-50/50'}`}`}>
                    <link.icon className="w-5 h-5" /> {link.label}
                  </Link>
                ))}
                {isStudent && (
                  <Link to="/notifications" onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive('/notifications') ? `bg-gradient-to-r ${accentBg} text-indigo-600` : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'}`}>
                    <Bell className="w-5 h-5" /> Notifications {unreadCount > 0 && <span className="text-xs bg-rose-500/20 text-rose-600 px-2 py-0.5 rounded-full">{unreadCount}</span>}
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-rose-600 transition-colors mt-2 border-t border-slate-200 pt-3">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
