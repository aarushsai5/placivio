export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="glass-card-hover p-8 flex flex-col items-center text-center group">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
        <Icon className="w-8 h-8 text-primary-light group-hover:text-accent-light transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
