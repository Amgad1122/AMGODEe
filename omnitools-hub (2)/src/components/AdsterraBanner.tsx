import React, { useEffect, useRef } from 'react';

interface AdsterraBannerProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * مكون احترافي لعرض إعلانات Adsterra (البنرات) في تطبيقات React (SPAs).
 * 
 * يحل هذا المكون المشاكل التالية في Vite و React:
 * 1. عزل `window.atOptions`: يتم إنشاء iframe داخلي لكل بنر، مما يعطي كل إعلان 
 *    كائن `window` مستقل تماماً، وبذلك لا تتداخل إعدادات البنرات ذات المقاسات المختلفة.
 * 2. تجنب مشاكل `document.write`: سكربتات Adsterra غالباً تستخدم `document.write`. 
 *    استخدامها داخل React مباشرة قد يؤدي لمسح محتوى الصفحة. الـ iframe يحمي الـ DOM الرئيسي.
 * 3. HMR & StrictMode: عند إعادة الرندرة، يتم تحديث محتوى الـ iframe بنظافة دون تكرار 
 *    حقن السكربتات في رأس الصفحة الرئيسية.
 */
export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ adKey, width, height, className = '' }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    // محتوى الـ Iframe الذي يعزل الإعلان بالكامل عن تطبيق React
    const adHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              overflow: hidden; 
              background-color: transparent; 
            }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            window.atOptions = {
              'key' : '${adKey}',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(adHtml);
    doc.close();
  }, [adKey, width, height]);

  return (
    <div className={`flex justify-center items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-inner ${className}`} style={{ minWidth: width, minHeight: height }}>
      <iframe
        ref={iframeRef}
        title={`Adsterra-${adKey}`}
        width={width}
        height={height}
        style={{ border: 'none', overflow: 'hidden', backgroundColor: 'transparent' }}
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};
