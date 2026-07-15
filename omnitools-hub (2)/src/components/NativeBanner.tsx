import React, { useEffect, useRef } from 'react';

/**
 * مكون إعلان Native Banner
 * 
 * يحل مشاكل StrictMode من خلال التأكد من عدم حقن السكربت أكثر من مرة،
 * ويقوم بتنظيف الـ DOM عند المغادرة.
 */
export const NativeBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptUrl = 'https://pl30372291.effectivecpmnetwork.com/20cccacba61db04f5a2d4e55ad0682d7/invoke.js';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // الحماية ضد إعادة الرندرة المتكررة في React Strict Mode
    const existingScript = container.querySelector(`script[src="${scriptUrl}"]`);
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.dataset.cfasync = 'false';
    
    container.appendChild(script);

    return () => {
      // التنظيف الآمن عند الـ Unmount
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
      if (container) {
        container.innerHTML = ''; // تفريغ محتوى الإعلان
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center p-4 glass-panel rounded-2xl overflow-hidden my-6">
      {/* الحاوية الأصلية المطلوبة من Adsterra */}
      <div id="container-20cccacba61db04f5a2d4e55ad0682d7" ref={containerRef}></div>
    </div>
  );
};
