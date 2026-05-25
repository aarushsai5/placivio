import { Check } from 'lucide-react';

export default function ProgressBar({ currentStep, totalSteps, labels = [] }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-dark-surface">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="relative flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25'
                    : isCurrent
                    ? 'bg-dark-surface border-2 border-primary text-primary-light animate-pulse-glow'
                    : 'bg-dark-surface border border-white/10 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step}
              </div>
              {labels[i] && (
                <span
                  className={`mt-2.5 text-xs font-medium whitespace-nowrap ${
                    isCompleted || isCurrent ? 'text-primary-light' : 'text-slate-500'
                  }`}
                >
                  {labels[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
