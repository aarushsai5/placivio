import { Bell, Clock, Star, AlertTriangle, Zap, CheckCircle2, Target } from 'lucide-react';

export default function AlertsPanel({ alerts = [] }) {
  if (alerts.length === 0) return null;

  const typeConfig = {
    deadline: {
      icon: <Clock className="w-4 h-4" />,
      iconBg: 'bg-red-50 text-red-600',
      border: 'border-red-100',
    },
    opportunity: {
      icon: <Target className="w-4 h-4" />,
      iconBg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
    reminder: {
      icon: <Bell className="w-4 h-4" />,
      iconBg: 'bg-indigo-50 text-indigo-605',
      border: 'border-indigo-100',
    },
  };

  return (
    <div className="space-y-2.5">
      {alerts.map((alert, i) => {
        const config = typeConfig[alert.type] || typeConfig.reminder;
        return (
          <div
            key={alert._id || i}
            className={`flex items-start gap-3 p-3.5 rounded-xl border bg-white/50 transition-all duration-200 ${config.border} ${
              !alert.isRead ? 'ring-1 ring-indigo-500/10' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 leading-relaxed">{alert.message}</p>
              <p className="text-xs text-slate-400 mt-1.5">
                {new Date(alert.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {!alert.isRead && (
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2 animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
}
