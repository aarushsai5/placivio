import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const icons = { success: CheckCircle, error: AlertTriangle, info: Info };
  const colors = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    error: 'border-rose-200 bg-rose-50 text-rose-800',
    info: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map(t => {
          const Icon = icons[t.type] || icons.info;
          return (
            <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl animate-slide-up ${colors[t.type] || colors.info}`}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium flex-1">{t.message}</p>
              <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-4 h-4" /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
