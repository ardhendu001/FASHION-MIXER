
import React from 'react';
import { FashionConcept } from '../types';

interface ResultCardProps {
  data: FashionConcept;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const { ui_theme, generated_image, shopping_items, concept_details, mood_board_images } = data;

  return (
    <div 
      className="mt-12 rounded-3xl p-6 md:p-12 backdrop-blur-xl border shadow-2xl transition-all duration-1000 transform animate-fade-in-up"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.25)`,
        color: ui_theme.text_color
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Left Column: Concept Text */}
        <div className="flex flex-col justify-start order-2 lg:order-1">
          <div className="mb-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 leading-tight break-words" style={{ textShadow: '0px 2px 20px rgba(0,0,0,0.1)' }}>
              {data.concept_name}
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {data.design_dna_tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: ui_theme.secondary_hex,
                    color: ui_theme.text_color,
                    borderColor: 'rgba(255,255,255,0.3)',
                    filter: 'brightness(1.1)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Rationale Quote */}
            <p className="text-lg md:text-xl leading-relaxed font-light italic opacity-95 mb-8">
              "{data.rationale}"
            </p>

            {/* Detailed Key-Value Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold uppercase tracking-widest opacity-60">Fabrication</h5>
                <p className="text-sm font-medium leading-snug">{concept_details.fabrication}</p>
              </div>
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold uppercase tracking-widest opacity-60">Silhouette</h5>
                <p className="text-sm font-medium leading-snug">{concept_details.silhouette_structure}</p>
              </div>
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold uppercase tracking-widest opacity-60">Color Theory</h5>
                <p className="text-sm font-medium leading-snug">{concept_details.color_theory}</p>
              </div>
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold uppercase tracking-widest opacity-60">Muse / Character</h5>
                <p className="text-sm font-medium leading-snug">{concept_details.muse_character}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 md:p-6 rounded-xl bg-black/5 border border-white/10 opacity-75 hover:opacity-100 transition-opacity">
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60">Visual DNA Prompt</h4>
            <p className="font-mono text-[10px] md:text-xs opacity-80 break-words leading-relaxed">
              {data.visual_prompt}
            </p>
          </div>
        </div>

        {/* Right Column: Generated Visualization */}
        <div className="relative group min-h-[300px] md:min-h-[400px] bg-black/20 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center order-1 lg:order-2">
          {generated_image ? (
            <>
              <img 
                src={`data:image/jpeg;base64,${generated_image}`} 
                alt="AI Generated Concept" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl pointer-events-none"></div>
            </>
          ) : (
            <div className="flex flex-col items-center p-8 text-center opacity-60 animate-pulse">
              <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Materializing Concept Visualization...</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Shopping Grounding */}
      {shopping_items && shopping_items.length > 0 && (
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-white/20">
          <div className="flex items-center gap-3 mb-8 opacity-80">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <h3 className="text-sm font-bold uppercase tracking-widest">Curated Catalog (Google Search)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shopping_items.map((item, i) => (
              <a 
                key={i} 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 flex items-start gap-4"
              >
                {/* Visual Anchor */}
                <div className="w-20 h-20 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center p-2 relative border border-white/10">
                    <img 
                        src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(item.url)}&size=128`}
                        alt="Product Source"
                        className="w-full h-full object-contain opacity-90 transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.classList.add('after:content-["🛍️"]', 'after:text-3xl', 'after:opacity-50');
                        }}
                    />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 py-1 flex flex-col justify-between h-20">
                    <div className="flex justify-between items-start gap-2">
                         <h4 className="font-medium text-sm leading-snug group-hover:underline decoration-1 underline-offset-4 line-clamp-2">
                          {item.title}
                        </h4>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="text-xs opacity-50 truncate font-mono max-w-[200px]">
                          {new URL(item.url).hostname.replace('www.', '')}
                        </div>
                        <span className="text-[9px] opacity-40 font-mono border border-white/20 px-1.5 py-0.5 rounded ml-2 flex-shrink-0">AD</span>
                    </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Mood Board Gallery */}
      {mood_board_images && mood_board_images.length > 0 && (
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-white/20">
          <div className="flex items-center gap-3 mb-8 opacity-80">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <h3 className="text-sm font-bold uppercase tracking-widest">Theme Mood Board</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mood_board_images.map((img, i) => (
              <div 
                key={i}
                className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 cursor-zoom-in"
              >
                <img 
                  src={`data:image/jpeg;base64,${img}`} 
                  alt={`Mood board ${i}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                    {i === 0 ? "Texture" : i === 1 ? "Architecture" : "Palette"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
