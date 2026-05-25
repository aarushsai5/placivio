export default function StatCard({ icon: Icon, label, value, color = 'primary' }) {
  const colorMap = {
    primary: {
      iconBg: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
      iconColor: 'text-indigo-400',
      valueBg: 'gradient-text',
      cardClass: 'stat-card-primary',
    },
    green: {
      iconBg: 'bg-gradient-to-br from-emerald-500/20 to-green-500/20',
      iconColor: 'text-emerald-400',
      valueBg: 'text-emerald-400',
      cardClass: 'stat-card-green',
    },
    accent: {
      iconBg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400',
      valueBg: 'text-purple-400',
      cardClass: 'stat-card-accent',
    },
    yellow: {
      iconBg: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20',
      iconColor: 'text-amber-400',
      valueBg: 'text-amber-400',
      cardClass: 'stat-card-yellow',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className={`glass-card p-5 group cursor-default border ${c.cardClass} transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${c.iconColor}`} />
        </div>
      </div>
      <p className={`text-3xl font-black ${c.valueBg} mb-1`}>{value}</p>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}
