/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Wrench, ArrowRight, ArrowLeft } from 'lucide-react';
import { toolsData, categories } from './toolsData';
import { ToolModal } from './components/ToolModal';
import { uiTranslations, toolTranslations } from './translations';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Tools');
  const [activeToolId, setActiveToolId] = useState<number | null>(null);

  // Sync RTL/LTR attributes with active language
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const handleToolClick = (toolId: number) => {
    setActiveToolId(toolId);
  };

  // Filter tools based on search query (matching both English or Arabic names/descriptions)
  const filteredTools = useMemo(() => {
    return toolsData.filter(tool => {
      const enName = tool.name.toLowerCase();
      const enDesc = tool.desc.toLowerCase();
      const arName = (toolTranslations[tool.id]?.ar?.name || '').toLowerCase();
      const arDesc = (toolTranslations[tool.id]?.ar?.desc || '').toLowerCase();
      
      const query = searchQuery.toLowerCase();
      const matchesSearch = enName.includes(query) || 
                            enDesc.includes(query) || 
                            arName.includes(query) || 
                            arDesc.includes(query);
                            
      const matchesCategory = activeCategory === 'All Tools' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const isAr = lang === 'ar';
  const trans = uiTranslations[lang];

  return (
    <div className="bg-immersive min-h-screen text-gray-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 pb-16 md:pb-0 relative">
      <div className="bg-grid-overlay"></div>
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-panel border-b-0 border-b-white/5 rounded-b-2xl mx-auto max-w-7xl mt-4 px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-4 shrink-0 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Wrench size={22} className="transform rotate-45" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              {trans.logo}
            </span>
          </div>
          
          {/* Desktop Search Bar (Adapts layout for LTR vs RTL) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={trans.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-2.5 glass-button rounded-xl leading-5 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 sm:text-sm transition-all text-start`}
            />
          </div>
          
          {/* Language Switch Button */}
          <div className="flex items-center gap-4 px-2">
            <button 
              onClick={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 px-5 py-2 rounded-full glass-button hover:text-cyan-300 font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              <span>🌐 {isAr ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden pb-4 px-2 relative">
          <div className={`absolute inset-y-0 top-0 ${isAr ? 'right-0 pr-5' : 'left-0 pl-5'} flex items-center pointer-events-none`}>
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={trans.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`block w-full ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-2.5 glass-button rounded-xl leading-5 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 sm:text-sm text-start`}
          />
        </div>
      </nav>

      {/* Hero section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white leading-tight">
          {trans.heroTitle} <br className="hidden md:block"/> 
          <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-lime-400 bg-clip-text text-transparent">
            {trans.heroTitleSub}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
          {trans.heroSubtitle}
        </p>
      </header>

      {/* Main Layout Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 flex flex-col justify-center relative z-10">
        
        {/* Core Main Area */}
        <div className="flex-1 w-full">
          
          {/* Categories bar */}
          <div className="flex overflow-x-auto pb-4 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-3" dir={isAr ? "rtl" : "ltr"}>
            {categories.map(cat => {
              const localizedCatName = trans.categories[cat as keyof typeof trans.categories] || cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-semibold transition-all border cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-md' 
                      : 'glass-button text-gray-400'
                  }`}
                >
                  {localizedCatName}
                </button>
              );
            })}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => {
              const localizedName = toolTranslations[tool.id]?.[lang]?.name || tool.name;
              const localizedDesc = toolTranslations[tool.id]?.[lang]?.desc || tool.desc;
              const localizedCat = trans.categories[tool.category as keyof typeof trans.categories] || tool.category;

              return (
                <React.Fragment key={tool.id}>
                  <div 
                    onClick={() => handleToolClick(tool.id)}
                    className="group flex flex-col glass-panel glass-panel-hover rounded-2xl p-6 cursor-pointer overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-full -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-110"></div>
                    
                    <div className="flex items-start gap-5 mb-4 relative z-10">
                      <div className="p-3 bg-white/5 rounded-xl text-cyan-400 group-hover:text-fuchsia-400 transition-colors shadow-inner border border-white/10">
                        <tool.icon size={28} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="font-bold text-xl text-gray-100 group-hover:text-white transition-colors line-clamp-1 text-start tracking-tight">
                          {localizedName}
                        </h3>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mt-1 text-start group-hover:text-cyan-400/70 transition-colors">
                          {localizedCat}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 mt-auto text-start leading-relaxed font-medium relative z-10">
                      {localizedDesc}
                    </p>
                  </div>
                </React.Fragment>
              );
            })}
            
            {/* Empty search results fallback */}
            {filteredTools.length === 0 && (
              <div className="col-span-full py-32 text-center glass-panel rounded-3xl">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 text-gray-500 border border-white/10">
                  <Search size={40} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-bold text-gray-200 tracking-tight">{trans.noToolsFound}</h3>
                <p className="text-gray-500 mt-3 font-medium text-lg">{trans.noToolsFoundDesc}</p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Tool Execution Environment Modal */}
      <ToolModal 
        toolId={activeToolId} 
        onClose={() => setActiveToolId(null)} 
        lang={lang}
      />
    </div>
  );
}
