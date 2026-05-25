import { useState, useEffect } from 'react';
import { Bell, Building2, Zap, Target, Calendar, Trophy, BarChart3, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getNotifications, markAllNotificationsRead } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const TYPE_CONFIG = {
  drive: { icon: Building2, iconBg: 'bg-indigo-50 text-indigo-650' },
  alert: { icon: Target, iconBg: 'bg-amber-50 text-amber-655' },
  reminder: { icon: Calendar, iconBg: 'bg-rose-50 text-rose-650' },
  achievement: { icon: Trophy, iconBg: 'bg-emerald-50 text-emerald-650' },
  application: { icon: BarChart3, iconBg: 'bg-cyan-50 text-cyan-650' },
  shortlist: { icon: Zap, iconBg: 'bg-purple-50 text-purple-655' },
};

export default function Notifications() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifs(); }, []);

  const fetchNotifs = async () => {
    try {
      const { data } = await getNotifications(user.id || user._id);
      setNotifs(data);
    } catch { addToast('Failed to load notifications.', 'error'); }
    finally { setLoading(false); }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead(user.id || user._id);
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      addToast('All marked as read', 'success');
    } catch {}
  };

  if (loading) return <LoadingSpinner message="Loading notifications..." />;

  const unread = notifs.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-mesh">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/10">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">Notifications</h1>
              <p className="text-sm text-slate-550">{unread > 0 ? `${unread} unread` : 'All caught up!'}</p>
            </div>
          </div>
          {unread > 0 && (
            <button onClick={handleMarkAllRead} className="btn-secondary text-sm flex items-center gap-2">
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notifs.map(n => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.alert;
            const Icon = config.icon;
            return (
              <div key={n._id} className={`glass-card p-4 flex items-start gap-4 transition-all ${!n.isRead ? 'border-indigo-300 ring-1 ring-indigo-500/5' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-slate-800">{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-slate-500 mt-1.5">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            );
          })}
        </div>

        {notifs.length === 0 && (
          <div className="text-center py-20 glass-card">
            <Bell className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-lg text-slate-700">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
