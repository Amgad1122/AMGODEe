import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { ToolRenderer } from './ToolRenderer';

interface ToolModalProps {
  toolId: number | null;
  onClose: () => void;
  lang: 'en' | 'ar';
}

export function ToolModal({ toolId, onClose, lang }: ToolModalProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (toolId) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500); // 1.5 seconds loading for smoother experience
      return () => clearTimeout(timer);
    }
  }, [toolId]);

  if (!toolId) return null;

  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl transition-all duration-500" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col hide-scrollbar">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-white/5 backdrop-blur-3xl border-b border-white/5 shadow-sm">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tight">
            {loading 
              ? (isAr ? "جارِ التهيئة..." : "Initializing...") 
              : (isAr ? "بيئة عمل الأداة" : "Tool Environment")}
          </h2>
          <button 
            onClick={onClose}
            className={`p-2.5 text-gray-400 transition-all rounded-xl hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10 ${isAr ? 'mr-auto ml-0' : 'ml-auto mr-0'}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-10 relative">
          {/* Subtle glow behind content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-8 relative z-10">
              <div className="flex flex-col items-center space-y-6 text-center">
                <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
                <p className="text-2xl font-bold text-gray-200 tracking-tight">
                  {isAr ? "جارِ تحميل بيئة الأداة..." : "Processing tool environment..."}
                </p>
                <p className="text-lg text-gray-500 font-medium">
                  {isAr ? "يرجى الانتظار ثوانٍ قليلة بينما نجهز الموارد." : "Please wait while we load resources."}
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500 relative z-10">
              <ToolRenderer toolId={toolId} lang={lang} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
