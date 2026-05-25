import { ChevronDown, CheckCircle, Circle, Clock, ExternalLink, PlayCircle, BookOpen, FileText, Sparkles } from 'lucide-react';

const RESOURCE_ICONS = {
  video: PlayCircle,
  course: BookOpen,
  docs: FileText,
  article: FileText,
};

export default function WeekAccordion({ week, isOpen, onToggle, onComplete, isCurrent }) {
  const isComplete = week.completed;

  return (
    <div className={`glass-card overflow-hidden transition-all duration-400 ${
      isCurrent ? 'border-sky-500/30 shadow-lg shadow-sky-500/10' : ''
    } ${isComplete ? 'border-emerald-500/30' : ''}`}>
      {/* Header */}
      <button onClick={onToggle} className="w-full p-5 flex items-center gap-4 text-left hover:bg-slate-100/50 transition-all duration-300">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          isComplete
            ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20'
            : isCurrent
              ? 'bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/20 animate-pulse-glow'
              : 'bg-slate-100 border border-slate-200'
        }`}>
          {isComplete
            ? <CheckCircle className="w-5 h-5 text-emerald-500" />
            : isCurrent
              ? <Sparkles className="w-5 h-5 text-sky-500" />
              : <Circle className="w-5 h-5 text-slate-400" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isComplete ? 'text-emerald-600' : isCurrent ? 'text-sky-600' : 'text-slate-500'
            }`}>
              Week {week.weekNumber}
            </span>
            {isCurrent && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 border border-sky-500/20 font-semibold">
                Current
              </span>
            )}
            {isComplete && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold">
                Done ✓
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-800 truncate">{week.topic}</h3>
        </div>

        {week.estimatedHours && (
          <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Clock className="w-3.5 h-3.5" /> {week.estimatedHours}h
          </span>
        )}

        <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Content */}
      {isOpen && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 animate-fade-in bg-white/40">
          {/* Skills */}
          {week.skills?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skills Covered</p>
              <div className="flex flex-wrap gap-1.5">
                {week.skills.map(s => (
                  <span key={s} className={`skill-tag ${isComplete ? 'skill-tag-green' : 'skill-tag-blue'}`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {week.resources?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Learning Materials</p>
              <div className="space-y-2">
                {week.resources.map((r, i) => {
                  const IconComp = RESOURCE_ICONS[r.type?.toLowerCase()] || ExternalLink;
                  return (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-slate-200 hover:border-sky-500/40 transition-all duration-300 hover:translate-x-1 group shadow-sm hover:shadow-md"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500/20 transition-colors">
                        <IconComp className="w-4 h-4 text-sky-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 font-bold truncate group-hover:text-sky-600 transition-colors">{r.title}</p>
                        <p className="text-xs text-slate-500 font-medium capitalize">{r.type}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Complete button */}
          {!isComplete && (
            <button
              onClick={(e) => { e.stopPropagation(); onComplete(week.weekNumber); }}
              className="btn-glow w-full flex items-center justify-center gap-2 text-sm mt-4 py-3"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Week {week.weekNumber} Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
